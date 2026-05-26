import { buildProxyAuthHeaders, getApiBase } from '../env';

export { getProxyToken, hasProxyToken } from '../env';

export async function postChat({ provider, model, messages, apiKey }) {
  const apiBase = getApiBase();
  const url = `${apiBase}/v1/chat`;
  const headers = buildProxyAuthHeaders('application/json');
  if (!headers) {
    const err = new Error(
      'Missing VITE_PROXY_TOKEN. Add it to src/frontend/.env.local (must match root PROXY_AUTH_TOKEN) and restart the dev server.'
    );
    err.status = 0;
    throw err;
  }

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ provider, model, messages, apiKey }),
    });
  } catch (networkErr) {
    const err = new Error(
      `Cannot reach the API at ${apiBase}. Start the proxy with "npm run dev:backend" (default port 3001) and set VITE_API_BASE in src/frontend/.env.local to match.`
    );
    err.status = 0;
    err.cause = networkErr;
    throw err;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.error ||
      data?.details?.[0]?.message ||
      (typeof data?.details === 'string' ? data.details : null) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}
