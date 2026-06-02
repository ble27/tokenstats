// src/routes/chat.js
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { callOpenAI } from '../adapters/openaiAdapter.js';
import { callGroq } from '../adapters/groqAdapter.js';
import { callAnthropic } from '../adapters/anthropicAdapter.js';
import { callGemini } from '../adapters/geminiAdapter.js';
import { callPerplexity } from '../adapters/perplexityAdapter.js';
import { calculateCost } from '../utils/calculateCost.js';
import { verifyProviderKey } from '../utils/verifyProviderKey.js';

const router = Router();

const chatSchema = z.object({
  provider: z.enum(['openai', 'groq', 'anthropic', 'gemini', 'perplexity']),
  model: z.string().min(1),
  apiKey: z.string().min(8),
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
      })
    )
    .min(1),
});

router.post('/', async (req, res) => {
  const result = chatSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: result.error.issues,
    });
  }

  const { provider, model, messages, apiKey } = result.data;

  const verification = await verifyProviderKey(provider, apiKey, model);
  if (!verification.valid) {
    return res.status(401).json({
      success: false,
      error: verification.error || 'API key verification failed',
    });
  }

  let llmresponse;
  try {
    switch (provider) {
      case 'openai':
        llmresponse = await callOpenAI(messages, model, apiKey);
        break;
      case 'groq':
        llmresponse = await callGroq(messages, model, apiKey);
        break;
      case 'anthropic':
        llmresponse = await callAnthropic(messages, model, apiKey);
        break;
      case 'gemini':
        llmresponse = await callGemini(messages, model, apiKey);
        break;
      case 'perplexity':
        llmresponse = await callPerplexity(messages, model, apiKey);
        break;
      default:
        return res.status(400).json({ success: false, error: 'Unsupported provider' });
    }
  } catch (err) {
    console.error('[LLM API Error]:', err.message || err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: err.message,
    });
  }

  const { usage } = llmresponse;
  const { promptTokens, completionTokens } = usage;
  const totalCost = calculateCost(provider, model, promptTokens, completionTokens);

  try {
    await prisma.tokenLog.create({
      data: {
        provider,
        model,
        inputTokens: promptTokens,
        outputTokens: completionTokens,
        totalCost,
      },
    });
  } catch (err) {
    console.log(err);
  }

  res.json({
    content: llmresponse.content,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    },
    estimatedCost: totalCost,
  });
});

export default router;
