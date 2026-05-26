const STORAGE_KEY = 'tokenstats.google.session';

export const getGoogleRedirectUri = () => {
  const configured = import.meta.env.VITE_GOOGLE_REDIRECT_URI?.trim();
  if (configured) return configured;
  return `${window.location.origin}/auth/google/callback`;
};

export const loadGoogleSession = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveGoogleSession = (session) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const clearGoogleSession = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

export const fetchGoogleUser = async (accessToken) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Could not load your Google profile.');
  }

  return response.json();
};

export const parseOAuthHash = (hash) => {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const accessToken = params.get('access_token');
  const error = params.get('error');

  if (error) {
    throw new Error(params.get('error_description') || error);
  }

  if (!accessToken) {
    return null;
  }

  return {
    accessToken,
    expiresIn: Number(params.get('expires_in') || 0),
    tokenType: params.get('token_type') || 'Bearer',
  };
};
