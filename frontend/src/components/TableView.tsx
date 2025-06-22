import React from 'react';
import { ChartDataPoint } from '../types';

interface Props {
  data: ChartDataPoint[];
}

export const TableView: React.FC<Props> = ({ data }) => (
  <table border={1} cellPadding={4} style={{ width: '100%', marginTop: 20 }}>
    <thead>
      <tr>
        <th>日付</th><th>終値</th><th>始値</th><th>高値</th><th>安値</th><th>出来高</th>
      </tr>
    </thead>
    <tbody>
      {data.map(pt => (
        <tr key={pt.timestamp}>
          <td>{new Date(pt.timestamp * 1000).toLocaleDateString()}</td>
          <td>{pt.close}</td>
          <td>{pt.open}</td>
          <td>{pt.high}</td>
          <td>{pt.low}</td>
          <td>{pt.volume}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
