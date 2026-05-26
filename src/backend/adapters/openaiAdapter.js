import OpenAI from 'openai';

const OPENAI_BASE = 'https://api.openai.com/v1';

function getEnvClient() {
  const apiKey =
    process.env.OPENAI_API_KEY ||
    process.env.OPENAI_ADMIN_KEY ||
    process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('Missing credentials. Set OPENAI_API_KEY.');
  }

  return new OpenAI({ apiKey, baseURL: OPENAI_BASE });
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function createClient(apiKey) {
  if (apiKey) {
    return new OpenAI({ apiKey: apiKey.trim(), baseURL: OPENAI_BASE });
  }
  return getEnvClient();
}

export async function callOpenAI(messages, model, apiKey) {
  const client = createClient(apiKey);
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
