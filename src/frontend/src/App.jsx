import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './components/LandingPage';
import GoogleAuthCallback from './components/GoogleAuthCallback';
import DashboardLayout from './layouts/DashboardLayout';
import { useGoogleSignIn } from './hooks/useGoogleSignIn';
import { goToHome, goToWorkspace, HOME_PATH, isWorkspacePath, tabFromPathname } from './lib/navigation';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const AppShell = () => {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const { authStatus, authError, session, isSignedIn, handleSignIn, handleSignOut } =
    useGoogleSignIn({
      onSignedIn: goToWorkspace,
    });

  useEffect(() => {
    const syncPath = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  useEffect(() => {
    if (isSignedIn && pathname === HOME_PATH) {
      goToWorkspace();
    } else if (!isSignedIn && isWorkspacePath(pathname)) {
      goToHome();
    }
  }, [isSignedIn, pathname]);

  const handleSignOutAndHome = () => {
    handleSignOut();
    goToHome();
  };

  if (pathname === '/auth/google/callback') {
    return <GoogleAuthCallback />;
  }

  if (isSignedIn && isWorkspacePath(pathname)) {
    const initialTab = tabFromPathname(pathname) || 'workspace';
    return (
      <DashboardLayout
        userEmail={session?.profile?.email}
        onSignOut={handleSignOutAndHome}
        initialTab={initialTab}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[color:var(--text)] antialiased">
      <LandingPage
        onSignIn={handleSignIn}
        authStatus={authStatus}
        authError={authError}
        isSignedIn={isSignedIn}
        userEmail={session?.profile?.email}
        onSignOut={handleSignOutAndHome}
      />
    </div>
  );
};

const App = () => {
  if (!clientId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 text-sm text-rose-600">
        Missing VITE_GOOGLE_CLIENT_ID. Copy src/frontend/.env.example to .env.local and add your Google
        Web client ID.
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppShell />
    </GoogleOAuthProvider>
  );
};

export default App;
