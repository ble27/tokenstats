import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../../..');

describe('prisma client', () => {
  let tempDir;
  let prisma;

  beforeAll(async () => {
    tempDir = mkdtempSync(join(tmpdir(), 'tokenstats-prisma-'));
    const dbPath = join(tempDir, 'test.db');

    process.env.DATABASE_URL = `file:${dbPath}`;
    delete process.env.TURSO_DATABASE_URL;
    delete process.env.TURSO_AUTH_TOKEN;

    const prismaBin = join(repoRoot, 'node_modules/.bin/prisma');
    execSync(`"${prismaBin}" migrate deploy`, {
      cwd: repoRoot,
      env: { ...process.env },
      stdio: 'pipe',
    });

    delete globalThis.__prisma;
    const mod = await import('../prisma.js');
    prisma = mod.createPrismaClient();
  });

  afterAll(async () => {
    if (prisma) await prisma.$disconnect();
    if (tempDir) rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates and deletes a TokenLog row on file SQLite', async () => {
    const created = await prisma.tokenLog.create({
      data: {
        provider: 'test',
        model: 'vitest',
        inputTokens: 10,
        outputTokens: 5,
        totalCost: 0.001,
      },
    });

    expect(created.id).toBeTruthy();

    const found = await prisma.tokenLog.findUnique({ where: { id: created.id } });
    expect(found?.model).toBe('vitest');

    await prisma.tokenLog.delete({ where: { id: created.id } });
  });

  it('detects Turso from libsql DATABASE_URL', async () => {
    const { getLibsqlUrl } = await import('../prisma.js');
    const prevUrl = process.env.DATABASE_URL;
    const prevTurso = process.env.TURSO_DATABASE_URL;

    delete process.env.TURSO_DATABASE_URL;
    process.env.DATABASE_URL = 'libsql://example.turso.io';
    expect(getLibsqlUrl()).toBe('libsql://example.turso.io');

    process.env.TURSO_DATABASE_URL = 'libsql://from-turso.turso.io';
    expect(getLibsqlUrl()).toBe('libsql://from-turso.turso.io');

    process.env.DATABASE_URL = 'file:./dev.db';
    delete process.env.TURSO_DATABASE_URL;
    expect(getLibsqlUrl()).toBeNull();

    process.env.DATABASE_URL = prevUrl;
    if (prevTurso) process.env.TURSO_DATABASE_URL = prevTurso;
  });
});
