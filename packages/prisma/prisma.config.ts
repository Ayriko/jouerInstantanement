import { defineConfig } from "prisma/config";

// Load .env from monorepo root when running prisma CLI directly
try {
  process.loadEnvFile("../../.env");
} catch {
  // Ignore if .env doesn't exist (production)
}

export default defineConfig({
  schema: "./schema.prisma",
  migrations: {
    path: "./migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});
