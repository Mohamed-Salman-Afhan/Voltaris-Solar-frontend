import React, { useState, useEffect } from "react";
import {
  useGetAnalyticsDashboardQuery,
  useGetSolarUnitForUserQuery,
} from "@/lib/redux/query";
import SystemEfficiencyHeatmap from "./components/SystemEfficiencyHeatmap";
import WeatherImpactChart from "./components/WeatherImpactChart";
import FinancialROIChart from "./components/FinancialROIChart";
import AnomalyImpactChart from "./components/AnomalyImpactChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const AnalyticsPage = () => {
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedRange, setSelectedRange] = useState("30");

  const {
    data: solarUnit,
    isLoading: isSolarUnitLoading,
    isError: isSolarUnitError,
  } = useGetSolarUnitForUserQuery();

  const solarUnits = Array.isArray(solarUnit)
    ? solarUnit
    : solarUnit
    ? [solarUnit]
    : [];

  useEffect(() => {
    if (solarUnits.length > 0 && !selectedUnitId) {
      setSelectedUnitId(solarUnits[0]._id);
    }
  }, [solarUnits, selectedUnitId]);

  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    error: analyticsError,
  } = useGetAnalyticsDashboardQuery(
    { solarUnitId: selectedUnitId, days: selectedRange },
    { skip: !selectedUnitId }
  );

  const activeSolarUnit =
    solarUnits.find((u) => u._id === selectedUnitId) || solarUnits[0];

  if (isSolarUnitLoading || (isAnalyticsLoading && !isAnalyticsError)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e293b]"></div>
      </div>
    );
  }

  if (isSolarUnitError || solarUnits.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load Solar Unit. Please ensure you have a unit assigned.
      </div>
    );
  }

  if (isAnalyticsError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500 gap-2">
        <p className="font-bold text-lg">Failed to load Analytics Data</p>
        <p className="text-sm text-foreground">
          {analyticsError?.data?.message || JSON.stringify(analyticsError)}
        </p>
      </div>
    );
  }

  if (!analyticsData) return null;

  const { efficiency, weather, financials, anomalies } = analyticsData;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0f172a] dark:text-white">
            Performance Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Deep dive into your system's efficiency, financial return, and
            operational health.
          </p>
          {activeSolarUnit && (
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
              {activeSolarUnit.city}, {activeSolarUnit.country}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          {/* Time Range Selector */}
          <div className="w-[180px]">
            <Select value={selectedRange} onValueChange={setSelectedRange}>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 3 Months</SelectItem>
                <SelectItem value="180">Last 6 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Solar Unit Selector */}
          <div className="w-[200px]">
            <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Solar Unit" />
              </SelectTrigger>
              <SelectContent>
                {solarUnits.map((unit) => (
                  <SelectItem key={unit._id} value={unit._id}>
                    {unit.serialNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* 1. System Efficiency Heatmap */}
        <SystemEfficiencyHeatmap data={efficiency} />

        {/* 2. Weather Correlation */}
        <WeatherImpactChart data={weather} />

        {/* 3. Financial Return on Investment */}
        <FinancialROIChart data={financials} />

        {/* 4. Anomaly Cost Impact */}
        <AnomalyImpactChart data={anomalies} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
