import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: 'https://api.perplexity.ai/v1'
});

export async function callPerplexity(messages, model) {
    const response = await client.chat.completions.create({ model, messages });
    const choice = response.choices[0];
    return {
        content: choice.message.content,
        usage: {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
        }
    }
}