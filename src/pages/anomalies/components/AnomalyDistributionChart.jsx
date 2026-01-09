import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AnomalyDistributionChart = ({ anomalies }) => {
  const data = useMemo(() => {
    const counts = {};
    anomalies.forEach((a) => {
      const type = a.anomalyType.replace(/_/g, " ");
      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [anomalies]);

  const COLORS = [
    "var(--accent)", // Solar Yellow
    "var(--secondary)", // Secondary Navy
    "var(--primary)", // Primary Navy
    "var(--muted-foreground)", // Muted Gray
  ];

  return (
    <Card className="h-full rounded-xl shadow-lg border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-sm dark:bg-[var(--card)]/30">
      <CardHeader className="mt-2">
        <CardTitle className="text-base font-semibold text-[var(--primary)] tracking-tight">
          Anomaly Types Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[350px] text-xs w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={120}
                innerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="var(--card)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "0.8rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  color: "var(--foreground)",
                  fontSize: "0.8rem", // smaller font
                  padding: "0.5rem 0.75rem",
                }}
              />
              <Legend
                iconType="circle"
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  fontSize: "0.6rem", // smaller font
                  color: "var(--muted-foreground)",
                  marginTop: "0.75rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyDistributionChart;
