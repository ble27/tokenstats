import { useCallback, useState } from 'react';
import RunStatusBar from './RunStatusBar';

const TEXT_SCALE_STORAGE_KEY = 'tokenstats_results_text_scale';
const TEXT_SCALES = [
  { id: 'sm', label: 'A−', value: 0.875 },
  { id: 'md', label: 'A', value: 1 },
  { id: 'lg', label: 'A+', value: 1.125 },
  { id: 'xl', label: 'A++', value: 1.25 },
];

function readStoredScale() {
  try {
    const raw = localStorage.getItem(TEXT_SCALE_STORAGE_KEY);
    const match = TEXT_SCALES.find((s) => s.id === raw);
    if (match) return match.id;
  } catch {
    /* ignore */
  }
  return 'md';
}

const ResultsPanel = ({
  response,
  error,
  loading,
  durationMs,
  usage,
  estimatedCost,
  provider,
  model,
}) => {
  const [activeTab, setActiveTab] = useState('results');
  const [textScaleId, setTextScaleId] = useState(readStoredScale);

  const textScale = TEXT_SCALES.find((s) => s.id === textScaleId) ?? TEXT_SCALES[1];

  const setScale = useCallback((id) => {
    setTextScaleId(id);
    try {
      localStorage.setItem(TEXT_SCALE_STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const bodyClass = error
    ? 'results-panel__body results-panel__body--error'
    : 'results-panel__body';

  return (
    <div className="results-panel">
      <div className="pane-header results-panel__header">
        <div className="results-panel__tabs">
          <button
            type="button"
            className={`results-panel__tab${activeTab === 'results' ? ' results-panel__tab--active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Results
          </button>
        </div>
        <div
          className="results-panel__text-scale"
          role="group"
          aria-label="Response text size"
        >
          {TEXT_SCALES.map((scale) => (
            <button
              key={scale.id}
              type="button"
              className={`results-panel__scale-btn${textScaleId === scale.id ? ' results-panel__scale-btn--active' : ''}`}
              onClick={() => setScale(scale.id)}
              aria-pressed={textScaleId === scale.id}
              title={`Text size: ${scale.label}`}
            >
              {scale.label}
            </button>
          ))}
        </div>
      </div>
      <div
        className={bodyClass}
        style={{ fontSize: `calc(0.8125rem * ${textScale.value})` }}
        tabIndex={0}
        aria-label="Model response"
      >
        {loading && <span className="results-panel__placeholder">Running prompt…</span>}
        {!loading && error && error}
        {!loading && !error && response && response}
        {!loading && !error && !response && (
          <span className="results-panel__placeholder">
            Your response will appear here after you run a prompt.
          </span>
        )}
      </div>
      <RunStatusBar
        loading={loading}
        durationMs={durationMs}
        usage={usage}
        estimatedCost={estimatedCost}
        provider={provider}
        model={model}
      />
    </div>
  );
};

export default ResultsPanel;
