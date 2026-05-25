import OpenAI from 'openai';

const GROQ_BASE = 'https://api.groq.com/openai/v1';

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

export async function callGroq(messages, model, apiKey) {
  const client = new OpenAI({ apiKey: apiKey.trim(), baseURL: GROQ_BASE });
  const response = await client.chat.completions.create({ model, messages });
  const content = response.choices[0]?.message?.content ?? '';

  let promptTokens = response.usage?.prompt_tokens;
  let completionTokens = response.usage?.completion_tokens;

  if (!promptTokens || !completionTokens) {
    let estimatedPrompt = 0;
    for (const msg of messages) {
      estimatedPrompt += 4 + estimateTokens(msg.content);
    }
    estimatedPrompt += 3;
    promptTokens = estimatedPrompt;
    completionTokens = estimateTokens(content);
  }

  return {
    content,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    },
  };
}
