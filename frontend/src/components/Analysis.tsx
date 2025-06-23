import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type DataPoint = {
  year: number;
  value: number;
};

const defaultInitialValue = 10000; // 初期資産1万円

const investmentTrusts = {
  sp500: 0.07,
  allCountry: 0.055,
};

const Analysis: React.FC = () => {
  const [mode, setMode] = useState<"manual" | "preset">("preset");
  const [selectedTrust, setSelectedTrust] = useState<keyof typeof investmentTrusts>("sp500");
  const [manualRate, setManualRate] = useState<string>("5"); // %
  const [years, setYears] = useState<number>(10);

  const [data, setData] = useState<DataPoint[]>([]);

  // 複利計算とデータ生成
  useEffect(() => {
    let rate: number;
    if (mode === "preset") {
      rate = investmentTrusts[selectedTrust];
    } else {
      const parsed = parseFloat(manualRate);
      rate = isNaN(parsed) ? 0 : parsed / 100;
    }

    const newData: DataPoint[] = [];
    for (let year = 0; year <= years; year++) {
      // FV = PV * (1 + r)^n
      const value = defaultInitialValue * Math.pow(1 + rate, year);
      newData.push({ year, value: Number(value.toFixed(2)) });
    }
    setData(newData);
  }, [mode, selectedTrust, manualRate, years]);

  return (
    <div style={{ padding: "20px", maxWidth: 700, margin: "auto" }}>
      <h2>年率リターンによる資産推移シミュレーション</h2>

      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="radio"
            value="preset"
            checked={mode === "preset"}
            onChange={() => setMode("preset")}
          />
          投資信託を選択
        </label>
        <label style={{ marginLeft: 20 }}>
          <input
            type="radio"
            value="manual"
            checked={mode === "manual"}
            onChange={() => setMode("manual")}
          />
          手入力
        </label>
      </div>

      {mode === "preset" && (
        <select
          value={selectedTrust}
          onChange={(e) => setSelectedTrust(e.target.value as keyof typeof investmentTrusts)}
          style={{ padding: "4px 8px", marginBottom: 16 }}
        >
          <option value="sp500">S&P 500 (7%)</option>
          <option value="allCountry">オールカントリー (5.5%)</option>
        </select>
      )}

      {mode === "manual" && (
        <input
          type="number"
          value={manualRate}
          onChange={(e) => setManualRate(e.target.value)}
          placeholder="年率リターン (%)"
          step="0.1"
          min="0"
          max="100"
          style={{ padding: "4px 8px", marginBottom: 16, width: 150 }}
        />
      )}

      <div>
        <label>
          期間（年）:
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            min={1}
            max={50}
            step={1}
            style={{ marginLeft: 8, width: 80, padding: "4px 8px" }}
          />
        </label>
      </div>

      <ResponsiveContainer width="100%" height={300} debounce={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" label={{ value: "年数", position: "insideBottomRight", offset: -10 }} />
          <YAxis
            label={{ value: "資産額 (円)", angle: -90, position: "insideLeft" }}
            domain={["auto", "auto"]}
            tickFormatter={(val) => val.toLocaleString()}
          />
          <Tooltip formatter={(value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2 })} />
          <Legend />
          <Line type="monotone" dataKey="value" name="資産額" stroke="#8884d8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
//　投資信託の対象を増やしハードコード廃止
//　DB等に保存し、API経由で取得するようにする

export default Analysis;
