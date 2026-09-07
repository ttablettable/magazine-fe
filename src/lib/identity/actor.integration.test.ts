import assert from "node:assert/strict";
import { after, test } from "node:test";
import { loadEnvFile } from "node:process";
import { createPrismaClient } from "@/lib/db/createPrismaClient";
import { toVerifiedEvmWallets } from "@/lib/identity/wallets";

for (const path of [".env.local", ".env"]) {
  try {
    loadEnvFile(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

const shouldRun = process.env.TTABLE_DATABASE_INTEGRATION === "1";
const connectionString =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL;
const providerUserIds = ["privy:test:actor-a", "privy:test:actor-b"];

const prisma = shouldRun && connectionString
  ? createPrismaClient(connectionString)
  : null;

async function cleanSyntheticActors() {
  if (!prisma) return;
  const identities = await prisma.actorAuthIdentity.findMany({
    where: { provider: "privy", providerUserId: { in: providerUserIds } },
    select: { actorId: true },
  });
  const actorIds = identities.map(({ actorId }) => actorId);
  if (actorIds.length === 0) return;

  await prisma.$transaction([
    prisma.actorWallet.deleteMany({ where: { actorId: { in: actorIds } } }),
    prisma.actorRole.deleteMany({ where: { actorId: { in: actorIds } } }),
    prisma.actorAuthIdentity.deleteMany({ where: { actorId: { in: actorIds } } }),
    prisma.actorProfile.deleteMany({ where: { actorId: { in: actorIds } } }),
    prisma.actor.deleteMany({ where: { id: { in: actorIds } } }),
  ]);
}

after(async () => {
  if (prisma) {
    await cleanSyntheticActors();
    await prisma.$disconnect();
  }
});

test("Neon actor identity, concurrency, wallet, and profile regression", {
  skip: !shouldRun || !prisma,
}, async () => {
  const { resolveActorFromPrivyIdentity } = await import("@/lib/identity/actor");
  const { syncVerifiedWallets } = await import("@/lib/identity/wallet-sync");

  await cleanSyntheticActors();

  const [first, second] = await Promise.all([
    resolveActorFromPrivyIdentity(providerUserIds[0], prisma!),
    resolveActorFromPrivyIdentity(providerUserIds[0], prisma!),
  ]);
  const repeated = await resolveActorFromPrivyIdentity(providerUserIds[0], prisma!);
  const different = await resolveActorFromPrivyIdentity(providerUserIds[1], prisma!);

  assert.equal(first.actorId, second.actorId);
  assert.equal(first.actorId, repeated.actorId);
  assert.notEqual(first.actorId, different.actorId);
  assert.equal(first.profile.handle, null);
  assert.equal(first.profile.displayName, null);
  assert.deepEqual(first.roles, []);
  assert.deepEqual(first.capabilities, []);

  const identityCount = await prisma!.actorAuthIdentity.count({
    where: { provider: "privy", providerUserId: providerUserIds[0] },
  });
  assert.equal(identityCount, 1);

  await syncVerifiedWallets(
    first.actorId,
    toVerifiedEvmWallets([
      {
        type: "wallet",
        chain_type: "ethereum",
        address: "0xAa00000000000000000000000000000000000001",
      },
      {
        type: "wallet",
        chain_type: "ethereum",
        address: "0xBb00000000000000000000000000000000000002",
      },
      {
        type: "wallet",
        chain_type: "ethereum",
        address: "0xaa00000000000000000000000000000000000001",
      },
    ]),
    prisma!,
  );

  assert.equal(
    await prisma!.actorWallet.count({ where: { actorId: first.actorId } }),
    2,
  );
  const profile = await prisma!.actorProfile.findUnique({
    where: { actorId: first.actorId },
  });
  assert.equal(profile?.actorId, first.actorId);
  assert.equal(profile?.handle, null);
  assert.equal(profile?.displayName, null);

  await cleanSyntheticActors();
});
