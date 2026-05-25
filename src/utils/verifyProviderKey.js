import OpenAI from 'openai';
import { callAnthropic } from '../adapters/anthropicAdapter.js';
import { GEMINI_DEFAULT_MODEL, GEMINI_PAID_TIER_MODELS } from '../lib/geminiConstants.js';

const OPENAI_BASE = 'https://api.openai.com/v1';
const GROQ_BASE = 'https://api.groq.com/openai/v1';
const PERPLEXITY_BASE = 'https://api.perplexity.ai/v1';

function formatError(provider, message) {
  return { valid: false, error: message || `Invalid ${provider} API key` };
}

async function probeOpenAiCompatible(apiKey, baseURL) {
  const client = new OpenAI({ apiKey: apiKey.trim(), baseURL });
  await client.models.list({ limit: 1 });
  return { valid: true };
}

async function probeGeminiKey(apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey.trim())}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || `Gemini API error (${res.status})`;
    throw new Error(msg);
  }
  return { valid: true };
}

async function probeChatCompletion(apiKey, baseURL, model) {
  const client = new OpenAI({ apiKey: apiKey.trim(), baseURL });
  await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: 'ping' }],
    max_tokens: 1,
  });
  return { valid: true };
}

/**
 * @param {'openai'|'groq'|'anthropic'|'gemini'|'perplexity'} provider
 * @param {string} apiKey
 * @param {string} [model]
 */
export async function verifyProviderKey(provider, apiKey, model) {
  const key = apiKey?.trim();
  if (!key || key.length < 8) {
    return formatError(provider, 'API key is required');
  }

  try {
    switch (provider) {
      case 'openai': {
        try {
          await probeOpenAiCompatible(key, OPENAI_BASE);
          return { valid: true };
        } catch (listErr) {
          try {
            await probeChatCompletion(key, OPENAI_BASE, model || 'gpt-4o-mini');
            return { valid: true };
          } catch {
            return formatError(provider, listErr?.message || 'Could not verify OpenAI API key');
          }
        }
      }
      case 'groq': {
        try {
          await probeOpenAiCompatible(key, GROQ_BASE);
          return { valid: true };
        } catch (listErr) {
          try {
            await probeChatCompletion(key, GROQ_BASE, model || 'llama-3.1-8b-instant');
            return { valid: true };
          } catch {
            return formatError(provider, listErr?.message || 'Could not verify Groq API key');
          }
        }
      }
      case 'anthropic': {
        try {
          await callAnthropic([{ role: 'user', content: 'ping' }], model || 'claude-3-5-haiku-20241022', key);
          return { valid: true };
        } catch (err) {
          return formatError(provider, err?.message || 'Could not verify Anthropic API key');
        }
      }
      case 'gemini': {
        const selected = model || GEMINI_DEFAULT_MODEL;
        if (GEMINI_PAID_TIER_MODELS.has(selected)) {
          return formatError(
            provider,
            `${selected} is not available on the free tier. Use gemini-2.5-flash-lite or gemini-3.1-flash-lite.`
          );
        }
        try {
          await probeGeminiKey(key);
          return { valid: true };
        } catch (err) {
          return formatError(provider, err?.message || 'Could not verify Gemini API key');
        }
      }
      case 'perplexity': {
        try {
          await probeChatCompletion(key, PERPLEXITY_BASE, model || 'sonar');
          return { valid: true };
        } catch (err) {
          return formatError(provider, err?.message || 'Could not verify Perplexity API key');
        }
      }
      default:
        return formatError(provider, `Unsupported provider: ${provider}`);
    }
  } catch (err) {
    return formatError(provider, err?.message || 'Verification failed');
  }
}
