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

const migrationUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Client generation is intentionally possible without database credentials.
  // Commands that connect to Postgres prefer an explicit direct URL, then
  // Neon's native unpooled URL, and only then the pooled runtime URL.
  datasource: migrationUrl ? { url: migrationUrl } : undefined,
});
