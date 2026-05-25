import { buildProxyAuthHeaders, getApiBase } from '../env';

function authHeaders() {
  const headers = buildProxyAuthHeaders(null);
  if (!headers) {
    throw new Error(
      'Missing VITE_PROXY_TOKEN. Add it to token-stats/.env.local (must match root PROXY_AUTH_TOKEN) and restart the dev server.'
    );
  }
  return headers;
}

export async function fetchAnalytics(range = 'all') {
  const params = range && range !== 'all' ? `?range=${encodeURIComponent(range)}` : '';
  const res = await fetch(`${getApiBase()}/v1/analytics${params}`, {
    headers: authHeaders(),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || `Failed to fetch analytics (${res.status})`);
  }

  if (Array.isArray(data)) {
    return { range: 'all', totalRecords: data.length, summary: data };
  }

  return {
    range: data.range || range,
    totalRecords: data.totalRecords ?? 0,
    summary: Array.isArray(data.summary) ? data.summary : [],
  };
}

export async function deleteAnalyticsLogs(range = 'all') {
  const params = range && range !== 'all' ? `?range=${encodeURIComponent(range)}` : '';
  const res = await fetch(`${getApiBase()}/v1/analytics${params}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || `Failed to delete logs (${res.status})`);
  }

  return data;
}
