import React, { useState } from 'react';
import { FetchForm } from './components/FetchForm';
import { ChartView } from './components/ChartView';
import { TableView } from './components/TableView';
import { JsonViewer } from './components/JsonViewer';
import { fetchChartData } from './api';
import { ChartDataPoint, FetchResponse } from './types';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [rawResponse, setRawResponse] = useState<FetchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async (payload: { symbol: string; range: string; interval: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchChartData(payload);
      setRawResponse(res);

      const result = res.data.chart.result[0];
      const ts = result.timestamp;
      const quote = result.indicators.quote[0];
      const points: ChartDataPoint[] = ts.map((t, i) => ({
        timestamp: t,
        open: quote.open[i],
        high: quote.high[i],
        low: quote.low[i],
        close: quote.close[i],
        volume: quote.volume[i],
      }));
      setChartData(points);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h1>🔍 株価チャートビューア</h1>

      <FetchForm onSubmit={handleFetch} loading={loading} />

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {chartData.length > 0 && (
        <>
          <ChartView data={chartData} />
          <TableView data={chartData} />
        </>
      )}

      {rawResponse && <JsonViewer json={rawResponse} />}
    </div>
  );
};
