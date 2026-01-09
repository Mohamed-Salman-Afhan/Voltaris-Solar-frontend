import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { format } from "date-fns";
import { Activity } from "lucide-react";

// Ideally we'd use a real calendar heatmap lib, but for simplicity/consistency with existing Recharts stack,
// we'll use a Bar chart where color intensity represents efficiency.
const SystemEfficiencyHeatmap = ({ data = [] }) => {
  const chartData = data.map((d) => ({
    ...d,
    dateStr: format(new Date(d.date), "MMM d"),
  }));

  const getColor = (efficiency) => {
    if (efficiency >= 15) return "#22c55e"; // Green (Good)
    if (efficiency >= 10) return "#eab308"; // Yellow (Average)
    return "#ef4444"; // Red (Poor)
  };

  return (
    <Card className="rounded-xl shadow-lg border border-[var(--border)] bg-white dark:bg-[#09090b]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Daily System Efficiency (PR)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Capacity Factor % per day. Green indicates optimal performance.
        </p>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="dateStr"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis fontSize={12} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="efficiency" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.efficiency)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SystemEfficiencyHeatmap;
