import { useState } from 'react';
import { PROVIDER_META } from '../../lib/providerConfig';

const ApiKeyField = ({ id = 'apiKey', value, onChange, provider, className = '' }) => {
  const [visible, setVisible] = useState(false);
  const placeholder = PROVIDER_META[provider]?.keyHint
    ? `${PROVIDER_META[provider].keyHint} API key`
    : 'Provider API key';

  return (
    <div className={`api-key-field ${className}`.trim()}>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="workspace-toolbar__input api-key-field__input"
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
      <button
        type="button"
        className="api-key-field__toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide API key' : 'Show API key'}
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

export default ApiKeyField;
