import "server-only";

import type { PrismaClient } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import type { VerifiedWallet } from "@/lib/identity/wallets";

export async function syncVerifiedWallets(
  actorId: string,
  wallets: readonly VerifiedWallet[],
  prisma: PrismaClient = getPrisma(),
): Promise<void> {
  await prisma.$transaction(
    wallets.map((wallet) =>
      prisma.actorWallet.upsert({
        where: {
          actorId_chainNamespace_normalizedAddress: {
            actorId,
            chainNamespace: wallet.chainNamespace,
            normalizedAddress: wallet.normalizedAddress,
          },
        },
        create: { actorId, ...wallet },
        update: { address: wallet.address },
      }),
    ),
  );
}
