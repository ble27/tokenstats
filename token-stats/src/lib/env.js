/** @returns {string} Trimmed env string or empty */
function readEnv(value) {
  if (value == null || value === '') return '';
  return String(value).trim();
}

/**
 * Proxy bearer token for /v1/chat and /v1/analytics.
 * Must match root server PROXY_AUTH_TOKEN.
 */
export function getProxyToken() {
  const token =
    readEnv(import.meta.env.VITE_PROXY_TOKEN) ||
    readEnv(import.meta.env.VITE_PROXY_AUTH_TOKEN);
  return token;
}

export function hasProxyToken() {
  return getProxyToken().length > 0;
}

export function getApiBase() {
  return (
    readEnv(import.meta.env.VITE_API_BASE) ||
    readEnv(import.meta.env.VITE_API_BASE_URL) ||
    'http://127.0.0.1:3001'
  );
}

export function buildProxyAuthHeaders(contentType = 'application/json') {
  const token = getProxyToken();
  if (!token) return null;

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  return headers;
}
