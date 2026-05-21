import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const summary = await prisma.tokenLog.groupBy({
            by: ['provider', 'model'],
            _sum: { inputTokens: true, outputTokens: true, totalCost: true },
            _count: true
        });
        res.json(summary);
    } catch (err) {
        console.log('[analytics]', err.message);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
})

export default router