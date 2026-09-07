-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ActorRoleName" AS ENUM ('editorial', 'admin');

-- CreateTable
CREATE TABLE "Actor" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActorAuthIdentity" (
    "id" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActorAuthIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActorWallet" (
    "id" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "chainNamespace" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "normalizedAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActorWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActorProfile" (
    "actorId" UUID NOT NULL,
    "handle" TEXT,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActorProfile_pkey" PRIMARY KEY ("actorId")
);

-- CreateTable
CREATE TABLE "ActorRole" (
    "actorId" UUID NOT NULL,
    "role" "ActorRoleName" NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedByActorId" UUID,

    CONSTRAINT "ActorRole_pkey" PRIMARY KEY ("actorId","role")
);

-- CreateIndex
CREATE INDEX "ActorAuthIdentity_actorId_idx" ON "ActorAuthIdentity"("actorId");

-- CreateIndex
CREATE UNIQUE INDEX "ActorAuthIdentity_provider_providerUserId_key" ON "ActorAuthIdentity"("provider", "providerUserId");

-- CreateIndex
CREATE INDEX "ActorWallet_actorId_idx" ON "ActorWallet"("actorId");

-- CreateIndex
CREATE UNIQUE INDEX "ActorWallet_actorId_chainNamespace_normalizedAddress_key" ON "ActorWallet"("actorId", "chainNamespace", "normalizedAddress");

-- CreateIndex
CREATE INDEX "ActorRole_grantedByActorId_idx" ON "ActorRole"("grantedByActorId");

-- AddForeignKey
ALTER TABLE "ActorAuthIdentity" ADD CONSTRAINT "ActorAuthIdentity_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorWallet" ADD CONSTRAINT "ActorWallet_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorProfile" ADD CONSTRAINT "ActorProfile_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorRole" ADD CONSTRAINT "ActorRole_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorRole" ADD CONSTRAINT "ActorRole_grantedByActorId_fkey" FOREIGN KEY ("grantedByActorId") REFERENCES "Actor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
