import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useResizablePane } from '../../hooks/useResizablePane';
import pricingData from '../../../../../pricing.json';
import { formatModelLabel, getDefaultModel, isGeminiFreeTierModel } from '../../lib/providerConfig';
import { usePromptRun } from '../../hooks/usePromptRun';
import WorkspaceToolbar from './WorkspaceToolbar';
import ProviderCredentials from './ProviderCredentials';
import PromptEditor from './PromptEditor';
import ResultsPanel from './ResultsPanel';

const PROVIDERS = Object.keys(pricingData);
const API_KEY_STORAGE_PREFIX = 'tokenstats_api_key_';

function loadAllApiKeys() {
  const keys = {};
  for (const id of PROVIDERS) {
    try {
      keys[id] = sessionStorage.getItem(`${API_KEY_STORAGE_PREFIX}${id}`) || '';
    } catch {
      keys[id] = '';
    }
  }
  return keys;
}

function storeApiKey(provider, key) {
  try {
    if (key) {
      sessionStorage.setItem(`${API_KEY_STORAGE_PREFIX}${provider}`, key);
    } else {
      sessionStorage.removeItem(`${API_KEY_STORAGE_PREFIX}${provider}`);
    }
  } catch {
    /* ignore */
  }
}

const WorkspaceView = () => {
  const [provider, setProvider] = useState(PROVIDERS[0]);
  const [prompt, setPrompt] = useState('');
  const [apiKeys, setApiKeys] = useState(loadAllApiKeys);

  const models = useMemo(() => Object.keys(pricingData[provider] || {}), [provider]);
  const modelOptions = useMemo(
    () => models.map((m) => ({ value: m, label: formatModelLabel(provider, m) })),
    [models, provider]
  );
  const [model, setModel] = useState(models[0] || '');

  const { loading, response, error, durationMs, usage, estimatedCost, run, reset } = usePromptRun();
  const panelsRef = useRef(null);
  const { resultsPercent, onResizePointerDown, onResizeKeyDown } = useResizablePane(panelsRef);

  const activeApiKey = apiKeys[provider] || '';

  useEffect(() => {
    const nextModels = Object.keys(pricingData[provider] || {});
    setModel(getDefaultModel(provider, nextModels));
    reset();
  }, [provider, reset]);

  const handleApiKeyChange = useCallback((id, value) => {
    setApiKeys((prev) => {
      const next = { ...prev, [id]: value };
      storeApiKey(id, value);
      return next;
    });
  }, []);

  const handleRun = () => {
    run({ provider, model, prompt, apiKey: activeApiKey });
  };

  const canRun = Boolean(prompt.trim() && model && activeApiKey.trim());

  return (
    <div className="workspace-view">
      <ProviderCredentials
        providers={PROVIDERS}
        apiKeys={apiKeys}
        onApiKeyChange={handleApiKeyChange}
        activeProvider={provider}
      />
      <WorkspaceToolbar
        providers={PROVIDERS}
        provider={provider}
        onProviderChange={setProvider}
        models={modelOptions}
        model={model}
        onModelChange={setModel}
        onRun={handleRun}
        loading={loading}
        canRun={canRun}
      />
      <div
        ref={panelsRef}
        className="workspace-panels"
        style={{ '--results-pane-percent': `${resultsPercent}%` }}
      >
        <section className="workspace-editor-pane" aria-label="Prompt editor">
          <div className="pane-header">Editor</div>
          <PromptEditor
            value={prompt}
            onChange={setPrompt}
            placeholder="Write a prompt to test token usage and model output."
          />
        </section>
        <div
          className="workspace-panels__resize"
          role="separator"
          aria-orientation="horizontal"
          aria-valuenow={resultsPercent}
          aria-valuemin={20}
          aria-valuemax={80}
          aria-label="Resize results panel. Use arrow keys to adjust."
          tabIndex={0}
          onPointerDown={onResizePointerDown}
          onKeyDown={onResizeKeyDown}
        />
        <section className="workspace-results-pane" aria-label="Results">
          <ResultsPanel
            response={response}
            error={error}
            loading={loading}
            durationMs={durationMs}
            usage={usage}
            estimatedCost={estimatedCost}
            provider={provider}
            model={model}
          />
        </section>
      </div>
    </div>
  );
};

export default WorkspaceView;
