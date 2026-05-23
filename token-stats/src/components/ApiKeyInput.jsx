import { useState } from 'react';

const ApiKeyInput = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setApiKey(value);

    if (value.length < 10) {
      setError('API key must be at least 10 characters long.');
    } else {
      setError('');
    }

    onApiKeyChange(value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-[0.72rem] uppercase tracking-[0.25em] text-[color:var(--muted-2)]" htmlFor="apiKey">
        API key
      </label>
      <input
        type="text"
        id="apiKey"
        value={apiKey}
        onChange={handleChange}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'apiKey-error' : undefined}
        className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)] ${
          error ? 'border-rose-400 bg-rose-50' : 'border-[color:var(--border)] bg-white/80'
        }`}
        placeholder="Paste your key (stored securely)"
      />
      {error && (
        <p id="apiKey-error" className="text-rose-600 text-xs">
          {error}
        </p>
      )}
    </div>
  );
};

export default ApiKeyInput;
