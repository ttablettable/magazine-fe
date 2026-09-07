import "server-only";

import { createPrismaClient } from "@/lib/db/createPrismaClient";

type PrismaGlobal = typeof globalThis & {
  ttablePrisma?: ReturnType<typeof createPrismaClient>;
};

function databaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (!value) {
    throw new Error("Missing DATABASE_URL");
  }
  return value;
}

export function getPrisma() {
  const globalForPrisma = globalThis as PrismaGlobal;

  if (!globalForPrisma.ttablePrisma) {
    globalForPrisma.ttablePrisma = createPrismaClient(databaseUrl());
  }

  return globalForPrisma.ttablePrisma;
}
