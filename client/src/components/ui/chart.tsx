import * as React from "react";
import { AreaChart, BarChart, LineChart, PieChart } from "recharts";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartProps = {
  type: "bar" | "line" | "area" | "pie";
  data: any[];
  className?: string;
  xDataKey?: string;
  series: {
    dataKey: string;
    name?: string;
    color?: string;
  }[];
  options?: {
    grid?: boolean;
    legend?: boolean;
    tooltip?: boolean;
    xAxis?: boolean;
    yAxis?: boolean;
    formatter?: (value: number) => string;
  };
};

export function Chart({
  type,
  data,
  className,
  xDataKey = "name",
  series,
  options,
}: ChartProps) {
  const defaultColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const getFormattedValue = (value: number) => {
    if (options?.formatter) {
      return options.formatter(value);
    }
    return value;
  };

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart data={data}>
            {options?.xAxis !== false && (
              <XAxis
                dataKey={xDataKey}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
            )}
            {options?.yAxis !== false && (
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={getFormattedValue}
              />
            )}
            {options?.tooltip !== false && (
              <Tooltip
                formatter={getFormattedValue}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
            )}
            {options?.grid !== false && (
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
            )}
            {options?.legend !== false && <Legend />}
            {series.map((s, i) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                fill={s.color || defaultColors[i % defaultColors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data}>
            {options?.xAxis !== false && (
              <XAxis
                dataKey={xDataKey}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
            )}
            {options?.yAxis !== false && (
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={getFormattedValue}
              />
            )}
            {options?.tooltip !== false && (
              <Tooltip
                formatter={getFormattedValue}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
            )}
            {options?.grid !== false && (
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
            )}
            {options?.legend !== false && <Legend />}
            {series.map((s, i) => (
              <Line
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stroke={s.color || defaultColors[i % defaultColors.length]}
                dot={{ fill: s.color || defaultColors[i % defaultColors.length], r: 4 }}
                activeDot={{ r: 6 }}
                strokeWidth={2}
                type="monotone"
              />
            ))}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            {options?.xAxis !== false && (
              <XAxis
                dataKey={xDataKey}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
            )}
            {options?.yAxis !== false && (
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={getFormattedValue}
              />
            )}
            {options?.tooltip !== false && (
              <Tooltip
                formatter={getFormattedValue}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
            )}
            {options?.grid !== false && (
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
            )}
            {options?.legend !== false && <Legend />}
            {series.map((s, i) => (
              <Area
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stroke={s.color || defaultColors[i % defaultColors.length]}
                fill={s.color || defaultColors[i % defaultColors.length]}
                fillOpacity={0.2}
                strokeWidth={2}
                type="monotone"
              />
            ))}
          </AreaChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={series[0].dataKey}
              nameKey={xDataKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={series.length > 1 ? 60 : 0}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={defaultColors[index % defaultColors.length]}
                />
              ))}
            </Pie>
            {options?.tooltip !== false && (
              <Tooltip
                formatter={getFormattedValue}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
            )}
            {options?.legend !== false && <Legend />}
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
