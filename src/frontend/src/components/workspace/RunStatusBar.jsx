import { formatCurrency, formatNumber } from '../../lib/formatters';

const RunStatusBar = ({ loading, durationMs, usage, estimatedCost, provider, model }) => (
  <footer className="run-status-bar" aria-live="polite">
    <span>Status: {loading ? 'Running…' : 'Ready'}</span>
    {provider && model && (
      <span>
        {provider} / {model}
      </span>
    )}
    {durationMs != null && !loading && <span>{formatNumber(durationMs)} ms</span>}
    {usage && (
      <span>
        Tokens: {formatNumber(usage.promptTokens ?? 0)} in /{' '}
        {formatNumber(usage.completionTokens ?? 0)} out
      </span>
    )}
    {estimatedCost != null && !loading && (
      <span>Est. cost: {formatCurrency(estimatedCost)}</span>
    )}
  </footer>
);

export default RunStatusBar;
