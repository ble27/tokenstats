import { useEffect } from 'react';
import { useAnalytics, ANALYTICS_RANGES } from '../../hooks/useAnalytics';
import AnalyticsSummary from './AnalyticsSummary';
import AnalyticsTable from './AnalyticsTable';

const rangeLabel = (id) => ANALYTICS_RANGES.find((r) => r.id === id)?.label ?? id;

const AnalyticsView = () => {
  const {
    filteredRows,
    totals,
    range,
    setRange,
    totalRecords,
    status,
    deleteStatus,
    error,
    updatedAt,
    filter,
    setFilter,
    refresh,
    clearLogs,
    formatNumber,
    formatCurrency,
  } = useAnalytics();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleClear = () => {
    const scope =
      range === 'all'
        ? 'all usage logs'
        : `logs from the last ${rangeLabel(range)}`;
    if (!window.confirm(`Delete ${scope}? This cannot be undone.`)) return;
    clearLogs();
  };

  return (
    <div className="analytics-view">
      <div className="analytics-table-header" style={{ marginBottom: '1rem', border: 'none', padding: 0 }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', margin: 0 }}>Usage overview</h2>
          <p style={{ marginTop: '0.25rem' }}>
            {totalRecords} run{totalRecords === 1 ? '' : 's'} in range ({rangeLabel(range)})
          </p>
        </div>
        <div className="analytics-toolbar-actions">
          <div className="analytics-range" role="group" aria-label="Time range">
            {ANALYTICS_RANGES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`analytics-range__btn${range === item.id ? ' analytics-range__btn--active' : ''}`}
                onClick={() => setRange(item.id)}
                disabled={status === 'loading'}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="analytics-refresh focus-ring"
            onClick={refresh}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Refreshing…' : 'Refresh'}
          </button>
          <button
            type="button"
            className="analytics-clear focus-ring"
            onClick={handleClear}
            disabled={status === 'loading' || deleteStatus === 'loading' || totalRecords === 0}
          >
            {deleteStatus === 'loading' ? 'Deleting…' : 'Clear logs'}
          </button>
        </div>
      </div>

      <AnalyticsSummary totals={totals} formatNumber={formatNumber} formatCurrency={formatCurrency} />

      {status === 'error' && <p className="analytics-error">Analytics error: {error}</p>}

      <AnalyticsTable
        rows={filteredRows}
        status={status}
        filter={filter}
        onFilterChange={setFilter}
        updatedAt={updatedAt}
        formatNumber={formatNumber}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default AnalyticsView;
