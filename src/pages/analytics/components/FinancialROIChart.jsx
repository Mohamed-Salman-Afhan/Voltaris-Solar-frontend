import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { DollarSign } from "lucide-react";

const FinancialROIChart = ({ data = [] }) => {
  // Data: [{ month: 1, revenue: 100, cost: 20 }]

  return (
    <Card className="rounded-xl shadow-lg border border-[var(--border)] bg-white dark:bg-[#09090b]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          Financial ROI
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Estimated value generated vs. operational costs.
        </p>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.3}
            />
            <XAxis
              dataKey="month"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `Month ${val}`}
            />
            <YAxis fontSize={12} tickLine={false} axisLine={false} unit="$" />

            <Tooltip
              formatter={(value) => [`$${value.toFixed(2)}`, ""]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Legend iconType="circle" />

            <Bar
              dataKey="revenue"
              name="Value Generated"
              stackId="a"
              fill="#10b981"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="cost"
              name="Est. Cost"
              stackId="a"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FinancialROIChart;
