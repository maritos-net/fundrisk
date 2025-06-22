import axios from 'axios';
import { FetchRequest, FetchResponse } from './types';

export async function fetchChartData(payload: FetchRequest): Promise<FetchResponse> {
  const res = await axios.post<FetchResponse>(
    'http://127.0.0.1:3001/fetch',
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data;
}
