// src/utils/calculateCost.js
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Cache pricing at module load
const pricing = JSON.parse(
    readFileSync(join(__dirname, '../../../pricing.json'), 'utf-8')
);

/**
 * @param {string} provider
 * @param {string} model
 * @param {number} inputTokens
 * @param {number} outputTokens
 * @returns {number}
 */
export function calculateCost(provider, model, inputTokens, outputTokens) {
    const providerRate = pricing[provider]?.[model];
    if (!providerRate) {
        console.warn(`Warning: ${provider}/${model} not found in pricing.json`);
        return 0;
    }
    const inputRate = inputTokens / 1000 * providerRate.input;
    const outputRate = outputTokens / 1000 * providerRate.output;
    return inputRate + outputRate;
}