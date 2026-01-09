import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { CloudSun } from "lucide-react";

const WeatherImpactChart = ({ data = [] }) => {
  const chartData = data.map((d) => ({
    ...d,
    dateStr: format(new Date(d.date), "MMM d"),
  }));

  return (
    <Card className="rounded-xl shadow-lg border border-[var(--border)] bg-white dark:bg-[#09090b]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-yellow-500" />
          Weather Impact Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Correlating solar generation with cloud cover. High clouds should
          equal low energy.
        </p>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.3}
            />
            <XAxis
              dataKey="dateStr"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            {/* Left Axis: Energy */}
            <YAxis
              yAxisId="left"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              unit=" kWh"
            />

            {/* Right Axis: Cloud Cover */}
            <YAxis
              yAxisId="right"
              orientation="right"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              unit="%"
              domain={[0, 100]}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Legend iconType="circle" />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="energy"
              name="Energy Generated"
              fill="#3b82f6"
              stroke="#2563eb"
              fillOpacity={0.2}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cloudCover"
              name="Cloud Cover"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WeatherImpactChart;
