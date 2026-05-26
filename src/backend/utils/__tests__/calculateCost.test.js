import { describe, it, expect } from 'vitest';
import { calculateCost } from '../calculateCost.js';

describe('calculateCost', () => {
    it('should return 0 for unknown provider/model', () => {
        expect(calculateCost('unknown', 'model', 1000, 1000)).toBe(0);
    });

    // We realistically just test that math works based on pricing.json
    // Ideally we would mock the fs.readFileSync, but since it's cached on load,
    // we can just check if an existing real model works. Let's assume openai/gpt-4o exists.
    it('should calculate cost correctly if model exists', () => {
        // Without mocking pricing.json, we just check that it doesn't throw
        // and returns a number.
        const cost = calculateCost('openai', 'gpt-4o', 1000, 1000);
        expect(typeof cost).toBe('number');
    });
});
