import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Zap, Wind, TrendingUp, Activity } from "lucide-react";
import { useGetWeatherQuery } from "@/lib/redux/query";

const RealTimePowerCard = ({ solarUnit }) => {
  // Use weather query for wind speed
  const { data: weatherData } = useGetWeatherQuery(solarUnit._id, {
    pollingInterval: 600000,
    skip: !solarUnit._id,
  });

  // Simulate real-time power fluctuation
  // In a real app, this would come from a WebSocket or frequent polling
  const [currentPower, setCurrentPower] = useState(0);

  useEffect(() => {
    if (solarUnit?.capacity) {
      // Initialize
      const basePower = solarUnit.capacity * 0.4; // Assume 40% efficiency
      setCurrentPower(basePower);

      const interval = setInterval(() => {
        // Fluctuate by +/- 5%
        const fluctuation = (Math.random() - 0.5) * 0.1 * solarUnit.capacity;
        setCurrentPower((prev) => {
          let val = prev + fluctuation;
          if (val > solarUnit.capacity) val = solarUnit.capacity;
          if (val < 0) val = 0;
          return val;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [solarUnit]);

  if (!solarUnit) return null;

  const capacity = solarUnit.capacity || 10; // Default 10kW
  const efficiency = (currentPower / capacity) * 100;

  // Data for Gauge
  const data = [
    { name: "Power", value: currentPower },
    { name: "Remaining", value: capacity - currentPower },
  ];

  const COLORS = ["#ffffff", "rgba(255,255,255,0.2)"];

  const windSpeed = weatherData?.data?.windspeed || 0;

  return (
    <Card className="h-full border-none shadow-xl overflow-hidden relative">
<div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] dark:from-[var(--secondary)] dark:to-[var(--accent)]" />

      {/* Decorative circle */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

      <CardContent className="relative p-6 h-full flex flex-col justify-between text-white">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-5 h-5 text-yellow-300" />
          <h3 className="font-semibold text-lg tracking-wide">
            Real-Time Power
          </h3>
        </div>

        {/* Main Gauge */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[160px]">
          {/* Text Center */}
          <div className="absolute flex flex-col items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/6">
            <span className="text-2xl font-bold">
              {currentPower.toFixed(1)}{" "}
              <span className="text-sm font-medium">kW</span>
            </span>
            <span className="text-blue-100 text-sm">
              {efficiency.toFixed(1)}% Capacity
            </span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="60%"
                startAngle={180}
                endAngle={0}
                innerRadius={65}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 gap-3 mt-4">
          <div className="flex justify-between items-center border-b border-white/20 pb-2">
            <div className="flex items-center text-sm text-blue-100">
              <Wind className="w-4 h-4 mr-2" />
              Avg Wind Speed
            </div>
            <div className="font-semibold">{windSpeed} m/s</div>
          </div>

          <div className="flex justify-between items-center border-b border-white/20 pb-2">
            <div className="flex items-center text-sm text-blue-100">
              <Activity className="w-4 h-4 mr-2" />
              Avg Power (10 min)
            </div>
            <div className="font-semibold">
              {(currentPower * 0.9).toFixed(1)} kW
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-white/20 pb-2">
            <div className="flex items-center text-sm text-blue-100">
              <TrendingUp className="w-4 h-4 mr-2" />
              Peak Power
            </div>
            <div className="font-semibold">
              {(solarUnit.capacity * 0.85).toFixed(1)} kW
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePowerCard;
