import React, { useState } from "react";
import { useGetEnergyGenerationRecordsBySolarUnitQuery } from "@/lib/redux/query";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp } from "lucide-react";

// Helper to parse "2025-W05" into a Date (start of that week)
function parseWeekString(weekStr) {
  if (!weekStr || !weekStr.includes("-W")) return new Date();
  const [year, week] = weekStr.split("-W").map(Number);
  const simpleDate = new Date(year, 0, 1 + (week - 1) * 7);
  const day = simpleDate.getDay();
  const diff = simpleDate.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(simpleDate.setDate(diff));
}

const AnomalyHistoryChart = ({ solarUnitId, anomalies }) => {
  const [viewMode, setViewMode] = useState("daily"); // 'hourly', 'daily', 'weekly'

  // Query params based on viewMode
  let groupBy = "date";
  let limit = 30;
  if (viewMode === "hourly") {
    groupBy = "hour";
    limit = 48;
  } else if (viewMode === "weekly") {
    groupBy = "weekly";
    limit = 12;
  }

  const { data: energyData, isLoading } =
    useGetEnergyGenerationRecordsBySolarUnitQuery(
      { id: solarUnitId, groupBy, limit },
      { skip: !solarUnitId }
    );

  if (isLoading || !energyData) {
    return <Card className="h-[400px] animate-pulse bg-muted/20 rounded-xl" />;
  }

  // Prepare chart data (asceding order)
  const sortedData = [...energyData].reverse();
  const chartData = sortedData.map((record) => {
    let ts;
    // Defensive check: handle both raw records and aggregation results
    const dateStr = record._id?.date || record.timestamp;

    if (viewMode === "weekly") {
      ts = parseWeekString(dateStr);
    } else {
      ts = new Date(dateStr);
    }

    // Fix: Handle 0 values correctly (0 || undefined -> undefined)
    // Use null coalescing to accept 0 as a valid number
    const val = record.totalEnergy ?? record.energyGenerated ?? 0;

    return {
      timestamp: ts.getTime(),
      energy: val,
    };
  });

  // Calculate time range from chartData to filter anomalies
  const dataTimestamps = chartData.map((d) => d.timestamp);
  const minTime = Math.min(...dataTimestamps);
  const maxTime = Math.max(...dataTimestamps);

  // Map anomalies to scatter points, filtered by current time view
  const anomalyPoints = anomalies
    .map((a) => ({
      timestamp: new Date(a.detectionTimestamp).getTime(),
      energy: a.metrics.actualValue,
      type: a.anomalyType,
      severity: a.severity,
    }))
    .filter(
      (p) =>
        !isNaN(minTime) &&
        !isNaN(maxTime) &&
        p.timestamp >= minTime &&
        p.timestamp <= maxTime
    );

  // Calculate dynamic Y-axis max
  const maxEnergy = Math.max(...chartData.map((d) => d.energy), 0);
  const maxAnomaly = Math.max(...anomalyPoints.map((a) => a.energy), 0);
  const globalMax = Math.max(maxEnergy, maxAnomaly);
  // Add 10% headroom, ensure at least 100 if all 0
  const yAxisMax = globalMax > 0 ? Math.ceil(globalMax * 1.1) : 100;

  // Format X axis ticks
  const formatXAxis = (tick) => {
    const date = new Date(tick);
    if (viewMode === "hourly") return format(date, "HH:mm");
    if (viewMode === "daily") return format(date, "MMM d");
    if (viewMode === "weekly") return format(date, "'W'w");
    return "";
  };

  return (
    <Card className="rounded-xl shadow-lg border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-sm dark:bg-[var(--card)]/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-[var(--primary)] tracking-tight flex items-center gap-2">
          Internal Anomaly Trends
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
        </CardTitle>
        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger className="w-[120px] h-8 border-[var(--border)] bg-[var(--card)]/50 dark:bg-[var(--card)]/30 text-xs">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
                opacity={0.3}
              />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={formatXAxis}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis
                unit=" kWh"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                domain={[0, yAxisMax]}
              />
              <Tooltip
                labelFormatter={(label) => format(new Date(label), "PP p")}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  fontSize: "0.8rem",
                  color: "var(--foreground)",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "0.8rem",
                  color: "var(--muted-foreground)",
                  marginTop: "1rem",
                }}
              />

              <Line
                type="monotone"
                dataKey="energy"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--primary)" }}
                activeDot={{ r: 5 }}
                name="Energy Generation"
                animationDuration={500}
                connectNulls={true}
              />

              <Scatter
                name="Anomalies"
                data={anomalyPoints}
                fill="var(--destructive)"
                shape="cross"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyHistoryChart;
