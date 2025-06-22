import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { ChartDataPoint } from '../types';

interface Props {
  data: ChartDataPoint[];
}

export const ChartView: React.FC<Props> = ({ data }) => {
  const plotData = data.map(point => ({
    ...point,
    date: new Date(point.timestamp * 1000).toLocaleDateString(),
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={plotData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="close" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
