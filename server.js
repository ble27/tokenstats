import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { limiter } from './src/middleware/rateLimiter.js';
import { verifyProxyToken } from './src/middleware/verifyProxyToken.js';
import chatRouter from './src/routes/chat.js';
import analyticsRouter from './src/routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
// Allow all origins for local testing, and allow headers
app.use(cors({ origin: '*' })); 

app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

app.use(express.json());
app.use(limiter);
app.use(verifyProxyToken);
app.use('/v1/chat', chatRouter);
app.use('/v1/analytics', analyticsRouter);

app.use((err, req, res, next) => {
    console.error('[global error]', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Explicitly bind to 0.0.0.0 (all IPv4)
app.listen(PORT, '0.0.0.0', () => console.log(`[server] Running on port ${PORT}`));