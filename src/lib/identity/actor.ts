import "server-only";

import { Prisma, type PrismaClient } from "@/generated/prisma/client";
import { authenticatePrivyRequest, fetchVerifiedPrivyWallets } from "@/lib/auth/privy";
import { getPrisma } from "@/lib/db/prisma";
import { capabilitiesForRoles } from "@/lib/identity/policy";
import type { ActorContext, ActorRole } from "@/lib/identity/types";
import { syncVerifiedWallets } from "@/lib/identity/wallet-sync";

const PRIVY_PROVIDER = "privy";
const MAX_RESOLUTION_ATTEMPTS = 3;

const actorContextInclude = {
  profile: true,
  roles: { select: { role: true } },
} satisfies Prisma.ActorInclude;

type ActorWithContext = Prisma.ActorGetPayload<{
  include: typeof actorContextInclude;
}>;

function toActorContext(actor: ActorWithContext): ActorContext {
  const roles = actor.roles.map(({ role }) => role as ActorRole);
  return {
    actorId: actor.id,
    profile: {
      handle: actor.profile?.handle ?? null,
      displayName: actor.profile?.displayName ?? null,
    },
    roles,
    capabilities: capabilitiesForRoles(roles),
  };
}

function isRetryableIdentityRace(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2002" || error.code === "P2034")
  );
}

async function findActorByPrivyIdentity(
  providerUserId: string,
  prisma: PrismaClient,
): Promise<ActorWithContext | null> {
  const identity = await prisma.actorAuthIdentity.findUnique({
    where: {
      provider_providerUserId: {
        provider: PRIVY_PROVIDER,
        providerUserId,
      },
    },
    select: {
      actor: { include: actorContextInclude },
    },
  });
  return identity?.actor ?? null;
}

export async function resolveActorFromPrivyIdentity(
  providerUserId: string,
  prisma: PrismaClient = getPrisma(),
): Promise<ActorContext> {
  if (!providerUserId.trim()) {
    throw new Error("Privy user ID is required");
  }

  for (let attempt = 0; attempt < MAX_RESOLUTION_ATTEMPTS; attempt += 1) {
    const existing = await findActorByPrivyIdentity(providerUserId, prisma);
    if (existing) {
      return toActorContext(existing);
    }

    try {
      const created = await prisma.$transaction(
        async (transaction) => {
          const actor = await transaction.actor.create({
            data: { profile: { create: {} } },
            include: actorContextInclude,
          });
          await transaction.actorAuthIdentity.create({
            data: {
              actorId: actor.id,
              provider: PRIVY_PROVIDER,
              providerUserId,
            },
          });
          return actor;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return toActorContext(created);
    } catch (error) {
      if (!isRetryableIdentityRace(error)) {
        throw error;
      }
    }
  }

  const canonical = await findActorByPrivyIdentity(providerUserId, prisma);
  if (!canonical) {
    throw new Error("Unable to resolve canonical actor after identity race");
  }
  return toActorContext(canonical);
}

export async function resolveAuthenticatedActor(
  request: Request,
): Promise<ActorContext> {
  const identity = await authenticatePrivyRequest(request);
  const actor = await resolveActorFromPrivyIdentity(identity.providerUserId);
  const wallets = await fetchVerifiedPrivyWallets(identity.providerUserId);
  await syncVerifiedWallets(actor.actorId, wallets);
  return actor;
}
