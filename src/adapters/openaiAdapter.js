import OpenAI from 'openai';

const client = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1' 
});

function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}

export async function callOpenAI(messages, model) {
    const response = await client.chat.completions.create({ model, messages });
    const choice = response.choices[0];
    const content = choice.message.content;

    // check if usage exists before calculating theoretical cost
    let promptTokens = response.usage?.prompt_tokens;
    let completionTokens = response.usage?.completion_tokens;

    if (!promptTokens || !completionTokens) {
        let estimatedPrompt = 0;
        for (const msg of messages) {
            // the format of the prompt after api converts
            estimatedPrompt += 4;
            estimatedPrompt += estimateTokens(msg.content); 
        }
        estimatedPrompt += 3;
        
        promptTokens = estimatedPrompt;
        completionTokens = estimateTokens(content);
    }
    
    return {
        content: content,
        usage: {
            promptTokens: promptTokens,
            completionTokens: completionTokens,
            totalTokens: promptTokens + completionTokens
        }
    }
}