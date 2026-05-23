import { useState } from 'react';

const ApiKeyInput = ({ onApiKeyChange }) => {
  const exampleKey = 'sk_example_4f8d9c2b7a1e6f5h9k3m8x2q';

  return (
    <div className="space-y-2">
      <label className="block text-[0.72rem] uppercase tracking-[0.25em] text-[color:var(--muted-2)]" htmlFor="apiKey">
        API key
      </label>
      <input
        type="text"
        id="apiKey"
        value={exampleKey}
        disabled
        className="w-full rounded-2xl border border-[color:var(--border)] bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none cursor-not-allowed opacity-70"
        placeholder="Example API key (placeholder only)"
      />
      <p className="text-xs text-[color:var(--muted-2)]">
        Example key shown. Your actual keys will be stored securely when you connect.
      </p>
    </div>
  );
};

export default ApiKeyInput;
