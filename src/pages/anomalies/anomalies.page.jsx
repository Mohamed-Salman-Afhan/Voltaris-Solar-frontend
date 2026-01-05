import React, { useState } from "react";
import {
  useGetSolarUnitForUserQuery,
  useGetAnomaliesQuery,
  useUpdateAnomalyMutation,
  useGetEnergyGenerationRecordsBySolarUnitQuery,
} from "@/lib/redux/query";
import { format, subDays, isSameDay } from "date-fns";
import EnergyProductionCards from "./components/EnergyProductionCards";
import AnomalyCard from "./components/AnomalyCard";
import AnomalyHistoryChart from "./components/AnomalyHistoryChart";
import AnomalyDistributionChart from "./components/AnomalyDistributionChart";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/clerk-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductionCardsContainer = ({ solarUnitId, anomalies }) => {
  const [tab, setTab] = useState("ALL"); // ALL | ANOMALY

  const { data: energyData, isLoading } =
    useGetEnergyGenerationRecordsBySolarUnitQuery(
      { id: solarUnitId, groupBy: "date", limit: 7 },
      { skip: !solarUnitId }
    );

  if (isLoading || !energyData) return <Skeleton className="h-32 w-full" />;

  // Merge energy data with anomalies
  const processedData = energyData
    .map((record) => {
      const dateObj = new Date(record._id.date || record.timestamp);
      const dateStr = format(dateObj, "yyyy-MM-dd");

      // Find if any anomaly happened on this day
      const anomaly = anomalies.find((a) =>
        isSameDay(new Date(a.detectionTimestamp), dateObj)
      );

      return {
        day: format(dateObj, "EEE"),
        date: dateStr,
        production: record.totalEnergy || record.energyGenerated,
        hasAnomaly: !!anomaly,
        anomalyType: anomaly?.anomalyType,
        anomalyReason: anomaly?.description,
      };
    })
    .reverse(); // API returns descending, we probably want ascending or descending? Usually cards go left-to-right (past to now) or now to past. Let's keep descending (Newest first) or match UI.

  const filteredData =
    tab === "ANOMALY"
      ? processedData.filter((d) => d.hasAnomaly)
      : processedData;

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 bg-muted/50 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab("ALL")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            tab === "ALL"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All Days
        </button>
        <button
          onClick={() => setTab("ANOMALY")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            tab === "ANOMALY"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Has Anomaly
        </button>
      </div>

      <EnergyProductionCards energyProductionData={filteredData} />
    </div>
  );
};

const AnomaliesPage = () => {
  const { user } = useUser();
  const [filter, setFilter] = useState("NEW"); // 'NEW' or 'RESOLVED' or 'ALL'

  const { data: solarUnitResponse, isLoading: isUnitLoading } =
    useGetSolarUnitForUserQuery();

  // Handle array or single object response
  const solarUnits = Array.isArray(solarUnitResponse)
    ? solarUnitResponse
    : solarUnitResponse
    ? [solarUnitResponse]
    : [];

  // State for selected unit ID
  const [selectedUnitId, setSelectedUnitId] = useState("");

  // Set default selected unit when data loads
  React.useEffect(() => {
    if (solarUnits.length > 0 && !selectedUnitId) {
      setSelectedUnitId(solarUnits[0]._id);
    }
  }, [solarUnits, selectedUnitId]);

  const selectedUnit =
    solarUnits.find((u) => u._id === selectedUnitId) || solarUnits[0];
  const unitId = selectedUnit?._id;

  // Conditionally fetch only when unitId is available
  const { data: anomaliesResponse, isLoading: isAnomaliesLoading } =
    useGetAnomaliesQuery(
      { unitId, status: filter === "ALL" ? undefined : filter },
      { skip: !unitId }
    );

  const [updateAnomaly] = useUpdateAnomalyMutation();

  const handleResolve = async (id) => {
    try {
      await updateAnomaly({
        anomalyId: id,
        status: "RESOLVED",
        resolutionNotes: "Resolved by user",
      }).unwrap();
    } catch (err) {
      console.error("Failed to resolve anomaly", err);
    }
  };

  const anomalies = anomaliesResponse?.data || [];

  if (isUnitLoading) {
    return (
      <div className="mt-4 p-4 space-y-6">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (solarUnits.length === 0)
    return <div className="p-8">No solar unit found for this user.</div>;

  const criticalCount = anomalies.filter(
    (a) => a.severity === "CRITICAL"
  ).length;
  const warningCount = anomalies.filter((a) => a.severity === "WARNING").length;

  return (
    <main className="mt-4 p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            System Health & Anomalies
          </h1>
          <p className="text-muted-foreground mt-1">
            Diagnostic monitoring for {user?.firstName}'s Unit{" "}
            {selectedUnit && `(${selectedUnit.serialNumber})`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Unit Selector */}
          <div className="w-[200px]">
            <Select
              value={selectedUnitId}
              onValueChange={(value) => setSelectedUnitId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Solar Unit" />
              </SelectTrigger>
              <SelectContent>
                {solarUnits.map((unit) => (
                  <SelectItem key={unit._id} value={unit._id}>
                    {unit.serialNumber} ({unit.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setFilter("NEW")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === "NEW"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active Issues
            </button>
            <button
              onClick={() => setFilter("RESOLVED")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === "RESOLVED"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Resolved History
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full text-red-600 dark:text-red-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Critical Issues
              </p>
              <h3 className="text-3xl font-bold text-red-700 dark:text-red-300">
                {criticalCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/50">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Warnings
              </p>
              <h3 className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                {warningCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full text-green-600 dark:text-green-400">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                System Status
              </p>
              <h3 className="text-lg font-bold text-green-700 dark:text-green-300">
                {criticalCount > 0 ? "Attention Needed" : "Operational"}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Energy Production Cards - Last 7 Days */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Last 7 Days Energy Consumption
        </h2>
        {/* We need to fetch this data or derive it. For now, let's use a wrapper component that handles the data fetching 
                 or replicate the logic that was likely there. 
                 The user mentioned "tabs" to go from All to has anomaly. 
                 Since I stripped that logic, I should check if the previous file version had it or if I need to rebuild it using the existing components.
                 Given I don't see "tabs" in the EnergyProductionCards component I viewed, maybe the tabs were in the parent page.
                 Wait, I should check if I can just pass the data I have.
             */}
        <ProductionCardsContainer solarUnitId={unitId} anomalies={anomalies} />
      </div>

      {/* Charts Row */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnomalyDistributionChart anomalies={anomalies} />
        <AnomalyHistoryChart solarUnitId={unitId} anomalies={anomalies} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          {filter === "NEW" ? "Active Alerts" : "Resolved Alerts"}
        </h2>

        {isAnomaliesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : anomalies.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/25">
            <p className="text-muted-foreground">No anomalies found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <AnomalyCard
                key={anomaly._id}
                anomaly={anomaly}
                onResolve={handleResolve}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AnomaliesPage;
