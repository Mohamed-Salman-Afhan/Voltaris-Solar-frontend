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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--card)] p-3 rounded-xl shadow-xl border border-[var(--border)] text-sm">
        <p className="font-medium mb-1 text-[var(--foreground)]">
          {format(new Date(label), "PPP p")}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="flex items-center gap-2"
            style={{ color: entry.color }}
          >
            <span className="font-semibold">{entry.name}:</span>
            <span>{entry.value} kWh</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnomalyHistoryChart = ({ solarUnitId, anomalies = [] }) => {
  const [viewMode, setViewMode] = useState("daily"); // 'hourly', 'daily', 'weekly'

  // Query params based on viewMode
  let groupBy = "date";
  let limit = 30; // Default (Daily) limit: 30 days

  if (viewMode === "hourly") {
    groupBy = "hour";
    limit = 72; // Last 72 hours (3 days)
  } else if (viewMode === "weekly") {
    groupBy = "weekly";
    limit = 12; // Last 12 weeks
  }

  const { data: energyData, isLoading } =
    useGetEnergyGenerationRecordsBySolarUnitQuery(
      { id: solarUnitId, groupBy, limit },
      { skip: !solarUnitId }
    );

  if (isLoading || !energyData) {
    return (
      <Card className="rounded-xl shadow-lg border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </Card>
    );
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

    // Find anomalies that match this time bucket
    const matchingAnomalies = anomalies.filter((a) => {
      const aDate = new Date(a.detectionTimestamp);

      if (viewMode === "hourly") {
        // Match same hour (and day/month/year)
        return Math.abs(aDate.getTime() - ts.getTime()) < 3600000;
      } else if (viewMode === "daily") {
        // Match same day
        return aDate.toDateString() === ts.toDateString();
      } else if (viewMode === "weekly") {
        // Match same week (approximate by checking if within 7 days of start)
        const diff = aDate.getTime() - ts.getTime();
        return diff >= 0 && diff < 7 * 24 * 60 * 60 * 1000;
      }
      return false;
    });

    const anomalyValue =
      matchingAnomalies.length > 0
        ? Math.max(...matchingAnomalies.map((a) => a.metrics.actualValue || 0))
        : null;

    return {
      timestamp: ts.getTime(),
      energy: val,
      anomalyValue: anomalyValue, // For Scatter Y-axis
      anomalies: matchingAnomalies, // For Tooltip details
    };
  });

  // Calculate dynamic Y-axis max
  const maxEnergy = Math.max(...chartData.map((d) => d.energy), 0);
  const maxAnomaly = Math.max(...chartData.map((d) => d.anomalyValue || 0), 0);
  const globalMax = Math.max(maxEnergy, maxAnomaly);
  // Add 15% headroom for looks
  const yAxisMax = globalMax > 0 ? Math.ceil(globalMax * 1.15) : 100;

  // Format X axis ticks
  const formatXAxis = (tick) => {
    const date = new Date(tick);
    if (viewMode === "hourly") return format(date, "HH:mm");
    if (viewMode === "daily") return format(date, "MMM d");
    if (viewMode === "weekly") return format(date, "MMM d");
    return "";
  };

  return (
    <Card className="rounded-xl shadow-lg border border-[var(--border)] bg-white dark:bg-[#09090b] transition-all duration-300 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-[var(--border)]/50">
        <div className="flex flex-col gap-1 mt-4">
          <CardTitle className="text-lg font-bold text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2">
            Internal Anomaly Trends
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor energy generation relative to detected anomalies over time.
          </p>
        </div>

        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger className="w-[140px] h-9 border-gray-200 dark:border-gray-800 bg-white dark:bg-black font-medium">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[400px] w-full pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
                opacity={0.5}
              />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickMargin={15}
                minTickGap={30}
                interval="preserveStartEnd"
              />
              <YAxis
                unit=" kWh"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                domain={[0, yAxisMax]}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#94a3b8",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ paddingTop: "20px" }}
              />

              <Line
                type="monotone"
                dataKey="energy"
                stroke="#0f172a"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7, fill: "#0f172a", strokeWidth: 0 }}
                name="Energy Generation"
                animationDuration={1000}
                connectNulls={true}
              />

              <Line
                type="monotone"
                dataKey="anomalyValue"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4, fill: "#f97316", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#f97316", strokeWidth: 0 }}
                name="Anomalies"
                connectNulls={true}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyHistoryChart;
