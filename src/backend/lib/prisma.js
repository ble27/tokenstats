import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

/** @returns {string | null} libSQL URL when Turso (or remote libSQL) is configured */
export function getLibsqlUrl() {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;
  const db = process.env.DATABASE_URL ?? '';
  return db.startsWith('libsql:') ? db : null;
}

/**
 * Turso / libSQL when TURSO_DATABASE_URL (or libsql DATABASE_URL) is set.
 * Local file SQLite otherwise (DATABASE_URL=file:./dev.db under prisma/).
 */
export function createPrismaClient() {
  const libsqlUrl = getLibsqlUrl();

  if (libsqlUrl) {
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!authToken) {
      throw new Error(
        'TURSO_AUTH_TOKEN is required when using Turso (TURSO_DATABASE_URL or libsql DATABASE_URL)'
      );
    }
    const adapter = new PrismaLibSQL({
      url: libsqlUrl,
      authToken,
    });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}
