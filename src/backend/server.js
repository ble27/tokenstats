import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { limiter } from './middleware/rateLimiter.js';
import { verifyProxyToken } from './middleware/verifyProxyToken.js';
import chatRouter from './routes/chat.js';
import analyticsRouter from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1); // Trust X-Forwarded-For from reverse proxies (Fly.io, Vercel, etc.)
app.use(helmet());
// Use strict CORS in production, allow frontend only
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(cors({ 
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
})); 

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