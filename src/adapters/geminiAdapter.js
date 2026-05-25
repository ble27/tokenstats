function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function toGeminiContents(messages) {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
}

function formatGeminiError(data, status) {
  const msg = data?.error?.message || data?.error?.status || '';
  const text = typeof msg === 'string' ? msg : JSON.stringify(msg);

  if (
    text.includes('quota') ||
    text.includes('Quota exceeded') ||
    text.includes('RESOURCE_EXHAUSTED')
  ) {
    if (text.includes('free_tier') || text.includes('limit: 0')) {
      return (
        'This Gemini model is not on the free tier (quota limit: 0). ' +
        'Select gemini-2.5-flash-lite or gemini-3.1-flash-lite in the model dropdown.'
      );
    }
    const retryMatch = text.match(/retry in ([\d.]+)s/i);
    const retryHint = retryMatch ? ` Retry in ~${Math.ceil(Number(retryMatch[1]))}s.` : '';
    return `Gemini quota exceeded.${retryHint} See https://ai.google.dev/gemini-api/docs/rate-limits`;
  }

  return text || `Gemini error (${status})`;
}

export async function callGemini(messages, model, apiKey) {
  const systemInstruction = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

  const body = {
    contents: toGeminiContents(messages),
    generationConfig: { maxOutputTokens: 1024 },
  };
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(formatGeminiError(data, res.status));
  }

  const content =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '';

  const promptTokens =
    data.usageMetadata?.promptTokenCount ?? estimateTokens(JSON.stringify(messages));
  const completionTokens =
    data.usageMetadata?.candidatesTokenCount ?? estimateTokens(content);

  return {
    content,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    },
  };
}
