const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

export async function callAnthropic(messages, model, apiKey) {
  const systemParts = messages.filter((m) => m.role === 'system').map((m) => m.content);
  const chatMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

  const body = {
    model,
    max_tokens: 1024,
    messages: chatMessages,
  };
  if (systemParts.length) {
    body.system = systemParts.join('\n');
  }

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.trim(),
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || data?.error || `Anthropic error (${res.status})`);
  }

  const content =
    data.content?.find((block) => block.type === 'text')?.text ??
    data.content?.[0]?.text ??
    '';

  const promptTokens = data.usage?.input_tokens ?? estimateTokens(JSON.stringify(messages));
  const completionTokens = data.usage?.output_tokens ?? estimateTokens(content);

  return {
    content,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    },
  };
}
