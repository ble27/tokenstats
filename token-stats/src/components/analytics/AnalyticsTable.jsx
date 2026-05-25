const AnalyticsTable = ({
  rows,
  status,
  filter,
  onFilterChange,
  updatedAt,
  formatNumber,
  formatCurrency,
}) => (
  <section className="analytics-table-section">
    <div className="analytics-table-header">
      <div>
        <h2>Model breakdown</h2>
        <p>
          {updatedAt
            ? `Last updated ${updatedAt.toLocaleTimeString()}`
            : 'No refresh yet'}
        </p>
      </div>
      <input
        type="search"
        className="analytics-filter"
        placeholder="Filter by provider or model"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        aria-label="Filter analytics"
      />
    </div>
    <div className="analytics-table-wrap">
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Provider</th>
            <th>Model</th>
            <th>Requests</th>
            <th>Input tokens</th>
            <th>Output tokens</th>
            <th>Total cost</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="analytics-empty">
                {status === 'loading' ? 'Loading analytics…' : 'No analytics records found.'}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={`${row.provider}-${row.model}`}>
                <td>
                  <span className="pill">{row.provider}</span>
                </td>
                <td>{row.model}</td>
                <td>{formatNumber(row._count || 0)}</td>
                <td>{formatNumber(row._sum?.inputTokens || 0)}</td>
                <td>{formatNumber(row._sum?.outputTokens || 0)}</td>
                <td>{formatCurrency(row._sum?.totalCost || 0)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);

export default AnalyticsTable;
