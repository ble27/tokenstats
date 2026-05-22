// src/routes/chat.js
import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { callOpenAI } from '../adapters/openaiAdapter.js';
import { callPerplexity } from '../adapters/perplexityAdapter.js';
import { calculateCost } from '../utils/calculateCost.js';

const router = Router();
const prisma = new PrismaClient();

// Zod schema for request validation
const chatSchema = z.object({
    provider: z.enum(['openai', 'perplexity']),
    model: z.string().min(1),
    messages: z.array(z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
    })).min(1),
});

router.post('/', async (req, res) => {
    // Validate with Zod — return 400 on failure
    const result = chatSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: result.error.issues,
        })
    }
    const { provider, model, messages } = result.data;

    // Route to correct adapter based on provider
    let llmresponse;
    try {
        switch (provider) {
            case 'openai':
                llmresponse = await callOpenAI(messages, model);
                break;
            case 'perplexity':
                llmresponse = await callPerplexity(messages, model);
                break;
        }
    } catch (err) {
        console.error("[LLM API Error]:", err.message || err); 
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: err.message
        })
    }

    const { usage } = llmresponse;
    const { promptTokens, completionTokens } = usage;
    const totalCost = calculateCost(provider, model, promptTokens, completionTokens);
    // Log the analytics for each query's input and output tokens 
    try {
        await prisma.tokenLog.create({
            data: {
                provider: provider,
                model: model,
                inputTokens: promptTokens,
                outputTokens: completionTokens,
                totalCost: totalCost,
            }
        })
    } catch (err) {
        console.log(err)
    }
    // Return response to client
    res.json({ content: llmresponse.content });
});

export default router;