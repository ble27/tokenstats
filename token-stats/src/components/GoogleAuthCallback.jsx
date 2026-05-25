import React, { useEffect, useState } from 'react';
import { fetchGoogleUser, parseOAuthHash, saveGoogleSession } from '../lib/googleAuth';

const GoogleAuthCallback = () => {
  const [message, setMessage] = useState('Completing sign-in…');

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        const tokens = parseOAuthHash(window.location.hash);
        if (!tokens) {
          setMessage('No sign-in response received. You can close this window.');
          return;
        }

        const profile = await fetchGoogleUser(tokens.accessToken);
        const session = {
          accessToken: tokens.accessToken,
          expiresIn: tokens.expiresIn,
          profile,
          signedInAt: Date.now(),
        };

        saveGoogleSession(session);

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: 'tokenstats:google-auth', session }, window.location.origin);
          window.close();
          return;
        }

        window.location.replace('/workspace');
      } catch (error) {
        const text = error instanceof Error ? error.message : 'Sign-in failed.';
        setMessage(text);

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: 'tokenstats:google-auth-error', message: text },
            window.location.origin
          );
        }
      }
    };

    completeSignIn();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 text-sm text-[color:var(--muted)]">
      <p>{message}</p>
    </div>
  );
};

export default GoogleAuthCallback;
