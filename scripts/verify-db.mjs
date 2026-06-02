/**
 * Smoke-test Prisma against the configured database (local file or Turso).
 * Usage: npm run db:verify
 */
import 'dotenv/config';
import { createPrismaClient } from '../src/backend/lib/prisma.js';

const prisma = createPrismaClient();

const isTurso =
  Boolean(process.env.TURSO_DATABASE_URL) ||
  process.env.DATABASE_URL?.startsWith('libsql:');

async function main() {
  const countBefore = await prisma.tokenLog.count();

  const row = await prisma.tokenLog.create({
    data: {
      provider: 'verify',
      model: 'db-check',
      inputTokens: 1,
      outputTokens: 1,
      totalCost: 0,
    },
  });

  const countAfter = await prisma.tokenLog.count();
  if (countAfter !== countBefore + 1) {
    throw new Error(`Expected count ${countBefore + 1}, got ${countAfter}`);
  }

  await prisma.tokenLog.delete({ where: { id: row.id } });

  const countFinal = await prisma.tokenLog.count();
  if (countFinal !== countBefore) {
    throw new Error(`Cleanup failed: expected ${countBefore}, got ${countFinal}`);
  }

  console.log(
    JSON.stringify({
      ok: true,
      backend: isTurso ? 'turso' : 'sqlite-file',
      databaseUrl: isTurso
        ? (process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL)?.replace(
            /\/\/[^@]+@/,
            '//***@'
          )
        : process.env.DATABASE_URL,
    })
  );
}

main()
  .catch((err) => {
    console.error('[db:verify]', err.message || err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
