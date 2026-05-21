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
app.use(limiter);
app.use(verifyProxyToken);
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use('/v1/chat', chatRouter);
app.use('/v1/analytics', analyticsRouter);
app.use((err, req, res, next) => {
    console.error('[global error]', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`[server] Running on port ${PORT}`));
