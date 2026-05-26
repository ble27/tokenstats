/** Display labels and API key hints per pricing.json provider id */
export const PROVIDER_META = {
  openai: { label: 'OpenAI', keyHint: 'sk-…' },
  groq: { label: 'Groq', keyHint: 'gsk_…' },
  anthropic: { label: 'Anthropic', keyHint: 'sk-ant-…' },
  gemini: { label: 'Gemini', keyHint: 'AIza…' },
  perplexity: { label: 'Perplexity', keyHint: 'pplx-…' },
};

/** Default model per provider — free-tier friendly where possible */
export const DEFAULT_MODEL_BY_PROVIDER = {
  openai: 'gpt-4o-mini',
  groq: 'llama-3.1-8b-instant',
  anthropic: 'claude-3-5-haiku-20241022',
  gemini: 'gemini-2.5-flash-lite',
  perplexity: 'sonar',
};

/** Not on Google AI Studio free tier (quota limit: 0) */
export const GEMINI_PAID_TIER_MODELS = new Set([
  'gemini-2.5-pro',
  'gemini-3.1-pro',
  'gemini-2-flash',
  'gemini-2-flash-lite',
]);

export function isGeminiFreeTierModel(model) {
  return !GEMINI_PAID_TIER_MODELS.has(model);
}

export function formatModelLabel(provider, model) {
  if (provider === 'gemini') {
    if (GEMINI_PAID_TIER_MODELS.has(model)) {
      return `${model} (paid tier)`;
    }
    return `${model} (free tier)`;
  }
  return model;
}

export function getProviderLabel(id) {
  return PROVIDER_META[id]?.label ?? id;
}

export function getDefaultModel(provider, availableModels = []) {
  const preferred = DEFAULT_MODEL_BY_PROVIDER[provider];
  if (preferred && availableModels.includes(preferred)) return preferred;
  return availableModels[0] || '';
}
