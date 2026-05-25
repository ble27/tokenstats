import { useMemo } from 'react';

const PromptEditor = ({ value, onChange, placeholder }) => {
  const lineNumbers = useMemo(() => {
    const lines = Math.max(1, (value || '').split('\n').length);
    return Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  }, [value]);

  return (
    <div className="prompt-editor">
      <div className="prompt-editor__gutter" aria-hidden>
        {lineNumbers}
      </div>
      <textarea
        className="prompt-editor__textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        aria-label="Prompt"
      />
    </div>
  );
};

export default PromptEditor;
