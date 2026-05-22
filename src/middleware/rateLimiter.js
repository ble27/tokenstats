import rateLimit from 'express-rate-limit';
import { readFileSync } from 'node:fs';

export const limiter = rateLimit({
    // 60 secs
    windowMs: 60 * 1000,
    // 50 requests per 60 secs
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests. Try again later.'
    },
});