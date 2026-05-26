import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const rangeSchema = z.enum(['1d', '1w', '1m', 'all']).default('all');

function getWhereClause(range) {
  if (range === 'all') {
    return {};
  }

  const now = Date.now();
  const ms =
    range === '1d'
      ? 24 * 60 * 60 * 1000
      : range === '1w'
        ? 7 * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;

  return { timestamp: { gte: new Date(now - ms) } };
}

router.get('/', async (req, res) => {
  try {
    const parseResult = rangeSchema.safeParse(req.query.range);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid range parameter' });
    }
    
    const range = parseResult.data;
    const where = getWhereClause(range);

    const summary = await prisma.tokenLog.groupBy({
      by: ['provider', 'model'],
      where,
      _sum: { inputTokens: true, outputTokens: true, totalCost: true },
      _count: true,
    });

    const totalInRange = await prisma.tokenLog.count({ where });

    res.json({ range, totalRecords: totalInRange, summary });
  } catch (err) {
    console.log('[analytics]', err.message);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const parseResult = rangeSchema.safeParse(req.query.range);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid range parameter' });
    }
    
    const range = parseResult.data;
    const where = getWhereClause(range);
    const result = await prisma.tokenLog.deleteMany({ where });
    res.json({
      ok: true,
      range,
      deleted: result.count,
    });
  } catch (err) {
    console.log('[analytics delete]', err.message);
    res.status(500).json({ error: 'Failed to delete analytics logs' });
  }
});

export default router;
