import { useCallback, useEffect, useMemo, useState } from 'react';
import { deleteAnalyticsLogs, fetchAnalytics } from '../lib/api/analyticsClient';
import { formatCurrency, formatNumber } from '../lib/formatters';

export const ANALYTICS_RANGES = [
  { id: '1d', label: '1D' },
  { id: '1w', label: '1W' },
  { id: '1m', label: '1M' },
  { id: 'all', label: 'All' },
];

export function useAnalytics({ autoFetch = false } = {}) {
  const [rows, setRows] = useState([]);
  const [range, setRange] = useState('all');
  const [totalRecords, setTotalRecords] = useState(0);
  const [status, setStatus] = useState('idle');
  const [deleteStatus, setDeleteStatus] = useState('idle');
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);
  const [filter, setFilter] = useState('');

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError('');
    try {
      const data = await fetchAnalytics(range);
      setRows(data.summary);
      setTotalRecords(data.totalRecords);
      setStatus('success');
      setUpdatedAt(new Date());
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    }
  }, [range]);

  const clearLogs = useCallback(async () => {
    setDeleteStatus('loading');
    setError('');
    try {
      await deleteAnalyticsLogs(range);
      setDeleteStatus('success');
      await refresh();
    } catch (err) {
      setDeleteStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to delete logs');
    } finally {
      setDeleteStatus('idle');
    }
  }, [range, refresh]);

  useEffect(() => {
    if (autoFetch) refresh();
  }, [autoFetch, refresh]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          const input = row?._sum?.inputTokens || 0;
          const output = row?._sum?.outputTokens || 0;
          const cost = row?._sum?.totalCost || 0;
          const count = row?._count || 0;
          return {
            inputTokens: acc.inputTokens + input,
            outputTokens: acc.outputTokens + output,
            totalCost: acc.totalCost + cost,
            requests: acc.requests + count,
          };
        },
        { inputTokens: 0, outputTokens: 0, totalCost: 0, requests: 0 }
      ),
    [rows]
  );

  const filteredRows = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => {
      const provider = row?.provider?.toLowerCase() || '';
      const modelName = row?.model?.toLowerCase() || '';
      return provider.includes(query) || modelName.includes(query);
    });
  }, [rows, filter]);

  return {
    rows,
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
  };
}
