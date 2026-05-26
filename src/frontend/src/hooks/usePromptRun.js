import { useCallback, useState } from 'react';
import { hasProxyToken } from '../lib/env';
import { postChat } from '../lib/api/chatClient';

const PROXY_TOKEN_ERROR =
  'Missing VITE_PROXY_TOKEN. Add it to src/frontend/.env.local (must match root PROXY_AUTH_TOKEN) and restart the dev server.';

function normalizeContent(content) {
  if (content == null) return '';
  if (typeof content === 'string') return content;
  if (typeof content === 'number' || typeof content === 'boolean') return String(content);
  try {
    return JSON.stringify(content, null, 2);
  } catch {
    return String(content);
  }
}

export function usePromptRun() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [durationMs, setDurationMs] = useState(null);
  const [usage, setUsage] = useState(null);
  const [estimatedCost, setEstimatedCost] = useState(null);

  const reset = useCallback(() => {
    setResponse('');
    setError('');
    setDurationMs(null);
    setUsage(null);
    setEstimatedCost(null);
  }, []);

  const run = useCallback(async ({ provider, model, prompt, apiKey }) => {
    const trimmedPrompt = prompt?.trim();
    const trimmedKey = apiKey?.trim();

    if (!hasProxyToken()) {
      setError(PROXY_TOKEN_ERROR);
      setResponse('');
      return;
    }
    if (!trimmedKey) {
      setError('Enter your provider API key before running.');
      setResponse('');
      return;
    }
    if (!trimmedPrompt) {
      setError('Enter a prompt before running.');
      setResponse('');
      return;
    }
    if (!model) {
      setError('Select a model before running.');
      setResponse('');
      return;
    }

    setLoading(true);
    setResponse('');
    setError('');
    setDurationMs(null);
    setUsage(null);
    setEstimatedCost(null);

    const started = performance.now();

    try {
      const data = await postChat({
        provider,
        model,
        apiKey: trimmedKey,
        messages: [{ role: 'user', content: trimmedPrompt }],
      });
      setResponse(normalizeContent(data.content));
      setUsage(data.usage || null);
      setEstimatedCost(
        typeof data.estimatedCost === 'number' && Number.isFinite(data.estimatedCost)
          ? data.estimatedCost
          : null
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reach the proxy';
      setError(message);
      setResponse('');
    } finally {
      setDurationMs(Math.round(performance.now() - started));
      setLoading(false);
    }
  }, []);

  return { loading, response, error, durationMs, usage, estimatedCost, run, reset };
}
