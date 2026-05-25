/** Models that typically require paid quota on Google AI Studio free keys */
export const GEMINI_PAID_TIER_MODELS = new Set([
  'gemini-2.5-pro',
  'gemini-3.1-pro',
  'gemini-2-flash',
  'gemini-2-flash-lite',
]);

export const GEMINI_FREE_TIER_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-3-flash',
  'gemini-2.5-flash',
];

export const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash-lite';
