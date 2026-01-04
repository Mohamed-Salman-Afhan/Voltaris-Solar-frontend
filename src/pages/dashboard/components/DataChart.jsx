import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, toDate } from "date-fns";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetEnergyGenerationRecordsBySolarUnitQuery } from "@/lib/redux/query";

const DataChart = ({ solarUnitId }) => {
  const [selectedRange, setSelectedRange] = useState("7");

  const { data, isLoading, isError, error } =
    useGetEnergyGenerationRecordsBySolarUnitQuery({
      id: solarUnitId,
      groupBy: "date",
      limit: parseInt(selectedRange),
    });

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  if (isLoading) return null;

  if (!data || isError) {
    return null;
  }

  const lastSelectedRangeDaysEnergyProduction = data
    .slice(0, parseInt(selectedRange))
    .map((el) => {
      return {
        date: format(toDate(el._id.date), "MMM d"),
        energy: el.totalEnergy,
      };
    });

  const chartConfig = {
    energy: {
      label: "Production",
      color: "hsl(var(--primary))",
    },
  };

  const title = "Energy Production Chart";

  return (
    <Card className="rounded-xl shadow-lg border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm dark:bg-[var(--card)]/30">
      <div className="flex justify-between items-center gap-2 p-2">
        <div>
          <h2 className="ml-2 text-xl font-bold text-[var(--primary)] tracking-tight">
            {title}
          </h2>
          <p className="ml-2 text-sm text-[var(--muted-foreground)]">
            Historical generation overview
          </p>
        </div>
        <div>
          <Select value={selectedRange} onValueChange={handleRangeChange}>
            <SelectTrigger className="w-[140px] h-9 border-[var(--primary)]/20 bg-[var(--card)]/50 dark:bg-[var(--card)]/30">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <ChartContainer config={chartConfig} className="h-[310px] w-full">
          <AreaChart
            accessibilityLayer
            data={lastSelectedRangeDaysEnergyProduction}
            margin={{
              left: 30, // breathing room for Y-axis
              right: 10,
              top: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillEnergyDark" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--secondary)"
                  stopOpacity={0.85}
                />
                <stop
                  offset="50%"
                  stopColor="var(--primary)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="100%"
                  stopColor="var(--foreground)"
                  stopOpacity={0.25}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickCount={5}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              unit=" kWh"
            />

            <ChartTooltip
              cursor={{
                stroke: "var(--accent)",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
              content={
                <ChartTooltipContent
                  className="bg-[var(--card)]/90 backdrop-blur border-[var(--primary)]/10 shadow-xl rounded-xl p-3"
                  labelClassName="font-bold text-[var(--foreground)] mb-1"
                />
              }
            />

            <Area
              dataKey="energy"
              type="monotone"
              fill="url(#fillEnergyDark)" // use dark gradient theme
              fillOpacity={1}
              stroke="var(--accent)" // accent line for contrast
              strokeWidth={3}
              activeDot={{ r: 6, strokeWidth: 0, fill: "var(--accent)" }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
  );
};

export default DataChart;
