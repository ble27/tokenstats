import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="glass-card strong space-y-4 p-6 text-center sm:p-8">
      <div className="badge mx-auto w-fit">Secure access</div>
      <div>
        <h2 className="display-serif text-3xl leading-tight text-[color:var(--text)]">Login to Tokenstats</h2>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Sync usage history, manage team keys, and unlock shared dashboards.
        </p>
      </div>
      <button onClick={() => loginWithRedirect()} className="cta-primary focus-ring w-full">
        Log in
      </button>
    </div>
  );
};

export default Login;
