/**
 * Apply Prisma migrations to Turso (libSQL).
 * Prisma CLI only accepts file: URLs for sqlite migrate deploy — use this for remote Turso.
 *
 * Requires: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN
 */
import 'dotenv/config';
import { createHash, randomUUID } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createClient } from '@libsql/client';

import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const migrationsDir = join(repoRoot, 'prisma/migrations');

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url?.startsWith('libsql:')) {
  console.error('[db:migrate:turso] Set TURSO_DATABASE_URL=libsql://…');
  process.exit(1);
}
if (!authToken) {
  console.error('[db:migrate:turso] Set TURSO_AUTH_TOKEN');
  process.exit(1);
}

const client = createClient({ url, authToken });

async function ensureMigrationsTable() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "checksum" TEXT NOT NULL,
      "finished_at" DATETIME,
      "migration_name" TEXT NOT NULL,
      "logs" TEXT,
      "rolled_back_at" DATETIME,
      "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    )
  `);
}

async function appliedNames() {
  const result = await client.execute(
    'SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL'
  );
  return new Set(result.rows.map((r) => r.migration_name));
}

async function listMigrations() {
  const entries = await readdir(migrationsDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && e.name !== 'migration_lock.toml')
    .map((e) => e.name)
    .sort();
}

async function applyMigration(name) {
  const sqlPath = join(migrationsDir, name, 'migration.sql');
  const sql = await readFile(sqlPath, 'utf8');
  const checksum = createHash('sha256').update(sql).digest('hex');
  const id = randomUUID();

  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await client.execute(statement);
  }

  await client.execute({
    sql: `INSERT INTO "_prisma_migrations" (
      id, checksum, finished_at, migration_name, started_at, applied_steps_count
    ) VALUES (?, ?, datetime('now'), ?, datetime('now'), ?)`,
    args: [id, checksum, name, statements.length],
  });

  return { name, statements: statements.length };
}

async function main() {
  await ensureMigrationsTable();
  const done = await appliedNames();
  const pending = (await listMigrations()).filter((n) => !done.has(n));

  if (pending.length === 0) {
    console.log(JSON.stringify({ ok: true, applied: [], message: 'No pending migrations' }));
    return;
  }

  const applied = [];
  for (const name of pending) {
    applied.push(await applyMigration(name));
    console.log(`Applied: ${name}`);
  }

  console.log(JSON.stringify({ ok: true, applied }));
}

main()
  .catch((err) => {
    console.error('[db:migrate:turso]', err.message || err);
    process.exit(1);
  })
  .finally(() => client.close());
