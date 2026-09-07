import { loadEnvFile } from "node:process";
import { ActorRoleName } from "../src/generated/prisma/enums";
import { createPrismaClient } from "../src/lib/db/createPrismaClient";

for (const path of [".env.local", ".env"]) {
  try {
    loadEnvFile(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

function readFlag(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const actorId = readFlag("--actor-id");
const requestedRole = readFlag("--role");

if (!actorId || !requestedRole) {
  throw new Error(
    "Usage: npm run actor:grant-role -- --actor-id <uuid> --role <editorial|admin>",
  );
}

if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(actorId)) {
  throw new Error("--actor-id must be a UUID");
}

if (!Object.values(ActorRoleName).includes(requestedRole as ActorRoleName)) {
  throw new Error("Role must be one of: editorial, admin");
}

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DIRECT_URL or DATABASE_URL");
}

const prisma = createPrismaClient(connectionString);

try {
  const actor = await prisma.actor.findUnique({
    where: { id: actorId },
    select: { id: true },
  });
  if (!actor) {
    throw new Error(`Actor does not exist: ${actorId}`);
  }

  const role = requestedRole as ActorRoleName;
  const grant = await prisma.actorRole.upsert({
    where: { actorId_role: { actorId, role } },
    create: { actorId, role },
    update: {},
  });
  console.log(`Role ${grant.role} is granted to actor ${grant.actorId}`);
} finally {
  await prisma.$disconnect();
}
