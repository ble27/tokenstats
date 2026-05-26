const AnalyticsSummary = ({ totals, formatNumber, formatCurrency }) => (
  <div className="analytics-summary">
    <div className="analytics-summary__card">
      <p className="analytics-summary__label">Total requests</p>
      <p className="analytics-summary__value">{formatNumber(totals.requests)}</p>
    </div>
    <div className="analytics-summary__card">
      <p className="analytics-summary__label">Input tokens</p>
      <p className="analytics-summary__value">{formatNumber(totals.inputTokens)}</p>
    </div>
    <div className="analytics-summary__card">
      <p className="analytics-summary__label">Output tokens</p>
      <p className="analytics-summary__value">{formatNumber(totals.outputTokens)}</p>
    </div>
    <div className="analytics-summary__card">
      <p className="analytics-summary__label">Total cost</p>
      <p className="analytics-summary__value">{formatCurrency(totals.totalCost)}</p>
    </div>
  </div>
);

export default AnalyticsSummary;
