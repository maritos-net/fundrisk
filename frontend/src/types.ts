export interface FetchRequest {
  symbol: string;
  range: string;
  interval: string;
}

export interface FetchResponse {
  status: string;
  data: {
    chart: {
      result: Array<{
        timestamp: number[];
        indicators: {
          quote: Array<{
            open: number[];
            high: number[];
            low: number[];
            close: number[];
            volume: number[];
          }>;
        };
      }>;
      error: any;
    };
  };
}

export interface ChartDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
