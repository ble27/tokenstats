import ApiKeyField from '../shared/ApiKeyField';
import { getProviderLabel, PROVIDER_META } from '../../lib/providerConfig';

const ProviderCredentials = ({ providers, apiKeys, onApiKeyChange, activeProvider }) => (
  <section className="provider-credentials" aria-label="Provider API keys">
    <div className="provider-credentials__header">
      <h2 className="provider-credentials__title">API keys</h2>
      <p className="provider-credentials__desc">
        One key per provider. Only the key for the selected provider is sent when you run a prompt.
      </p>
    </div>
    <div className="provider-credentials__grid">
      {providers.map((id) => (
        <div
          key={id}
          className={`provider-credentials__card${id === activeProvider ? ' provider-credentials__card--active' : ''}`}
        >
          <div className="provider-credentials__card-head">
            <span className="provider-credentials__name">{getProviderLabel(id)}</span>
            <span className="provider-credentials__hint">{PROVIDER_META[id]?.keyHint}</span>
          </div>
          <ApiKeyField
            id={`api-key-${id}`}
            value={apiKeys[id] || ''}
            onChange={(value) => onApiKeyChange(id, value)}
            provider={id}
          />
        </div>
      ))}
    </div>
  </section>
);

export default ProviderCredentials;
