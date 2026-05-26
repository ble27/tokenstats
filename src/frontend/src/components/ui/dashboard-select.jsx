import { useEffect, useId, useRef, useState } from 'react';

const ChevronDown = () => (
  <svg className="ui-select__chevron" viewBox="0 0 24 24" aria-hidden width="16" height="16">
    <path
      d="M6 9l6 6 6-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Check = () => (
  <svg className="ui-select__check" viewBox="0 0 24 24" aria-hidden width="14" height="14">
    <path
      d="M5 12l4 4L19 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function normalizeOptions(options) {
  return options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : { value: opt.value, label: opt.label ?? opt.value }
  );
}

/**
 * Shadcn-inspired select (custom, no Radix) for dark dashboard toolbar.
 */
const DashboardSelect = ({
  id,
  value,
  options,
  onChange,
  placeholder = 'Select…',
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const items = normalizeOptions(options);
  const selected = items.find((item) => item.value === value);

  useEffect(() => {
    const handlePointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointer);
    return () => document.removeEventListener('mousedown', handlePointer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const display = selected?.label || placeholder;

  const pick = (next) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div className={`ui-select${open ? ' ui-select--open' : ''}`} ref={rootRef}>
      <button
        type="button"
        id={id}
        className="ui-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        disabled={disabled || items.length === 0}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`ui-select__value${!value ? ' ui-select__value--placeholder' : ''}`}>
          {display}
        </span>
        <ChevronDown />
      </button>
      {open && items.length > 0 && (
        <ul id={listId} role="listbox" className="ui-select__content" tabIndex={-1}>
          {items.map((item) => {
            const isSelected = item.value === value;
            return (
              <li key={item.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`ui-select__item${isSelected ? ' ui-select__item--selected' : ''}`}
                  onClick={() => pick(item.value)}
                >
                  <span className="ui-select__item-label">{item.label}</span>
                  {isSelected && <Check />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DashboardSelect;
