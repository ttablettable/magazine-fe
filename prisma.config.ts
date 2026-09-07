import { defineConfig } from "prisma/config";
import { loadEnvFile } from "node:process";

for (const path of [".env.local", ".env"]) {
  try {
    loadEnvFile(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Client generation is intentionally possible without database credentials.
  // Commands that connect to Postgres require DIRECT_URL or DATABASE_URL.
  datasource: migrationUrl ? { url: migrationUrl } : undefined,
});
