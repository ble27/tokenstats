const ProviderSelection = ({ providers, value, onSelectProvider }) => {
  const handleProviderChange = (e) => {
    onSelectProvider(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label
        className="block text-[0.72rem] uppercase tracking-[0.25em] text-[color:var(--muted-2)]"
        htmlFor="provider"
      >
        Provider
      </label>
      <select
        id="provider"
        value={value || ''}
        onChange={handleProviderChange}
        className="w-full rounded-2xl border border-[color:var(--border)] bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]"
      >
        <option value="" disabled>
          Select a provider
        </option>
        {providers.map((provider) => (
          <option key={provider} value={provider}>
            {provider}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProviderSelection;
