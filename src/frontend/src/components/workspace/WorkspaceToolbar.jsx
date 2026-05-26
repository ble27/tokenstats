import DashboardSelect from '../ui/dashboard-select';
import { hasProxyToken } from '../../lib/env';
import { getProviderLabel, isGeminiFreeTierModel } from '../../lib/providerConfig';

const WorkspaceToolbar = ({
  providers,
  provider,
  onProviderChange,
  models,
  model,
  onModelChange,
  onRun,
  loading,
  canRun,
}) => {
  const proxyConfigured = hasProxyToken();
  const providerOptions = providers.map((id) => ({
    value: id,
    label: getProviderLabel(id),
  }));

  return (
    <>
      <div className="workspace-toolbar">
        <div className="workspace-toolbar__field workspace-toolbar__field--provider">
          <label className="workspace-toolbar__label" htmlFor="toolbar-provider">
            Provider
          </label>
          <DashboardSelect
            id="toolbar-provider"
            value={provider}
            options={providerOptions}
            onChange={onProviderChange}
            placeholder="Select provider"
            aria-label="Provider"
          />
        </div>
        <div className="workspace-toolbar__field workspace-toolbar__field--model">
          <label className="workspace-toolbar__label" htmlFor="toolbar-model">
            Model
          </label>
          <DashboardSelect
            id="toolbar-model"
            value={model}
            options={models}
            onChange={onModelChange}
            placeholder="Select model"
            aria-label="Model"
            disabled={models.length === 0}
          />
        </div>
        <button
          type="button"
          className="workspace-toolbar__run focus-ring"
          onClick={onRun}
          disabled={loading || !canRun || !proxyConfigured}
        >
          {loading ? 'Running…' : 'Run'}
        </button>
      </div>
      {provider === 'gemini' && model && !isGeminiFreeTierModel(model) && (
        <p className="workspace-toolbar__hint workspace-toolbar__hint--warn">
          <code>{model}</code> is not on Gemini&apos;s free tier. Use{' '}
          <strong>gemini-2.5-flash-lite</strong> or <strong>gemini-3.1-flash-lite</strong>.
        </p>
      )}
      {!proxyConfigured && (
        <p className="workspace-toolbar__hint">
          Set <code>VITE_PROXY_TOKEN</code> in <code>src/frontend/.env.local</code> (same value as root{' '}
          <code>PROXY_AUTH_TOKEN</code>), then restart <code>npm run dev</code>.
        </p>
      )}
    </>
  );
};

export default WorkspaceToolbar;
