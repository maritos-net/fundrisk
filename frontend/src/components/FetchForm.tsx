import React, { useState, FormEvent } from 'react';
import { FetchRequest } from '../types';

interface Props {
  onSubmit: (payload: FetchRequest) => void;
  loading: boolean;
}

export const FetchForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [symbol, setSymbol] = useState('AAPL');
  const [range, setRange] = useState('2mo');
  const [interval, setInterval] = useState('1d');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ symbol, range, interval });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <label>
        シンボル：
        <input
          type="text"
          value={symbol}
          onChange={e => setSymbol(e.target.value.toUpperCase())}
          disabled={loading}
          style={{ margin: '0 8px' }}
        />
      </label>
      <label>
        取得期間：
        <select value={range} onChange={e => setRange(e.target.value)} disabled={loading}>
          {['1d','5d','1mo','3mo','6mo','1y','5y','max'].map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </label>
      <label>
        データ間隔：
        <select value={interval} onChange={e => setInterval(e.target.value)} disabled={loading}>
          {['1m','5m','1d','1wk','1mo'].map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={loading} style={{ marginLeft: 16 }}>
        {loading ? '取得中...' : '取得する'}
      </button>
    </form>
  );
};
