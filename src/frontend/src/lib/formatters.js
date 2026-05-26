/** Whole numbers for counts (tokens, requests). */
export function formatNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}

/**
 * USD display for per-1k token rates and run costs.
 * Avoids long floats like 0.0011713587446138263 in the UI.
 */
export function formatCurrency(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '$0.00';

  const abs = Math.abs(n);
  const maximumFractionDigits = abs < 0.01 ? 6 : abs < 1 ? 4 : 2;
  const minimumFractionDigits = abs < 0.01 ? 2 : 2;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(n);
}

/** Per-1k token rate label for run summary. */
export function formatRatePer1k(value) {
  return `${formatCurrency(value)} / 1k tokens`;
}
