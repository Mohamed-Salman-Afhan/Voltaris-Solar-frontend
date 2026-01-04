import React, { useState } from "react";
import { useGetCapacityFactorQuery } from "@/lib/redux/query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// Threshold colors
const getBarColor = (value) => {
  if (value > 20) return "#22c55e"; // Green-500
  if (value >= 15) return "#eab308"; // Yellow-500
  return "#ef4444"; // Red-500
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-zinc-950 p-3 border border-border rounded-lg shadow-lg">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-sm">
          Efficiency: <span className="font-bold">{data.capacity_factor}%</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Gener: {data.actual_energy.toFixed(1)} kWh
        </p>
        <p className="text-xs text-muted-foreground">
          Max: {data.theoretical_maximum.toFixed(1)} kWh
        </p>
      </div>
    );
  }
  return null;
};

const CapacityFactorChart = ({ solarUnitId }) => {
  const [days, setDays] = useState(7);
  const {
    data: response,
    isLoading,
    isError,
  } = useGetCapacityFactorQuery({
    solarUnitId,
    days,
  });

  if (!solarUnitId) return null;

  if (isLoading) {
    return <Skeleton className="w-full h-[300px] rounded-xl" />;
  }

  if (isError || !response?.success) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-[300px] text-red-500">
          Error loading efficiency data
        </CardContent>
      </Card>
    );
  }

  const { data, trend, average_cf } = response;

  const trendIcon = {
    improving: <TrendingUp className="w-4 h-4 text-green-500" />,
    declining: <TrendingDown className="w-4 h-4 text-red-500" />,
    stable: <Minus className="w-4 h-4 text-yellow-500" />,
  }[trend];

  const trendText = {
    improving: "Improving",
    declining: "Declining",
    stable: "Stable",
  }[trend];

  // Reverse data to show oldest to newest left to right if needed, but API usually returns descending?
  // Code in backend pushes days backwards: today-7, today-6...
  // Actually backed loop: for (i=days; i>0; i--) date = subDays(endDate, i).
  // So it pushes OLDER dates first. Order is correct (Ascending).

  return (
    <Card className="w-full h-full shadow-lg border-none bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-primary tracking-tight">
              System Efficiency
            </CardTitle>
            <CardDescription>Daily Capacity Factor</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold text-primary">
              {average_cf}%
            </div>
            <div className="flex items-center justify-end text-xs font-medium space-x-1">
              {trendIcon}
              <span
                className={
                  trend === "improving"
                    ? "text-green-600"
                    : trend === "declining"
                    ? "text-red-500"
                    : "text-yellow-600"
                }
              >
                {trendText}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(val) => val.split("-").slice(1).join("/")}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                unit="%"
                dx={-5}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0,0,0,0.05)", radius: 6 }}
              />
              <Bar dataKey="capacity_factor" radius={[6, 6, 6, 6]} barSize={24}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.capacity_factor)}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapacityFactorChart;
