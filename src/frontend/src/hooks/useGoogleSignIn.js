import { useCallback, useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import {
  clearGoogleSession,
  fetchGoogleUser,
  loadGoogleSession,
  saveGoogleSession,
} from '../lib/googleAuth';
import { goToWorkspace } from '../lib/navigation';

export const useGoogleSignIn = ({ onSignedIn = goToWorkspace } = {}) => {
  const [authStatus, setAuthStatus] = useState('idle');
  const [authError, setAuthError] = useState('');
  const [session, setSession] = useState(() => loadGoogleSession());

  const completeSignIn = useCallback(async (accessToken) => {
    const profile = await fetchGoogleUser(accessToken);
    const nextSession = {
      accessToken,
      profile,
      signedInAt: Date.now(),
    };
    saveGoogleSession(nextSession);
    setSession(nextSession);
    setAuthStatus('success');
    setAuthError('');
    onSignedIn();
  }, [onSignedIn]);

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        await completeSignIn(tokenResponse.access_token);
      } catch (error) {
        setAuthStatus('error');
        setAuthError(error instanceof Error ? error.message : 'Sign-in failed.');
      }
    },
    onError: (error) => {
      setAuthStatus('error');
      const detail = error?.error_description || error?.error || 'Google sign-in was cancelled.';
      setAuthError(detail);
    },
    onNonOAuthError: () => {
      setAuthStatus('error');
      setAuthError('Could not open Google sign-in. Check popup blockers and try again.');
    },
  });

  const handleSignIn = useCallback(() => {
    setAuthError('');
    setAuthStatus('loading');
    googleLogin();
    window.setTimeout(() => {
      setAuthStatus((current) => (current === 'loading' ? 'idle' : current));
    }, 800);
  }, [googleLogin]);

  const handleSignOut = useCallback(() => {
    clearGoogleSession();
    setSession(null);
    setAuthStatus('idle');
    setAuthError('');
  }, []);

  useEffect(() => {
    const onMessage = async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'tokenstats:google-auth') {
        setSession(event.data.session);
        setAuthStatus('success');
        setAuthError('');
        onSignedIn();
        return;
      }
      if (event.data?.type === 'tokenstats:google-auth-error') {
        setAuthStatus('error');
        setAuthError(event.data.message || 'Sign-in failed.');
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onSignedIn]);

  return {
    authStatus,
    authError,
    session,
    isSignedIn: Boolean(session?.profile),
    handleSignIn,
    handleSignOut,
  };
};
