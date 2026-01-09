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
  CartesianGrid,
} from "recharts";
import { AlertTriangle } from "lucide-react";

const AnomalyImpactChart = ({ data = [] }) => {
  // Data: [{ name: "Inverter Fault", value: 500 }]

  return (
    <Card className="rounded-xl shadow-lg border border-[var(--border)] bg-white dark:bg-[#09090b]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Anomaly Impact (Energy Lost)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Total kWh lost due to specific hardware issues.
        </p>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              opacity={0.3}
            />
            <XAxis
              type="number"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              unit=" kWh"
            />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />

            <Bar dataKey="value" name="Energy Lost" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#f97316" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnomalyImpactChart;
