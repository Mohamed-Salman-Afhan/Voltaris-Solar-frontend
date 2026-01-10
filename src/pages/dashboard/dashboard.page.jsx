import { useGetSolarUnitForUserQuery } from "@/lib/redux/query";
import DataChart from "./components/DataChart";
import WeatherWidget from "./components/WeatherWidget";
import CapacityFactorChart from "./components/CapacityFactorChart";
import RealTimePowerCard from "./components/RealTimePowerCard";
import DashboardAnomalies from "./components/DashboardAnomalies";
import { useUser } from "@clerk/clerk-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const { user, isLoaded } = useUser();
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  const {
    data: solarUnits = [], // Default to empty array, API now returns array
    isLoading: isLoadingSolarUnit,
    isError: isErrorSolarUnit,
    error: errorSolarUnit,
  } = useGetSolarUnitForUserQuery(undefined, { skip: !isLoaded || !user });

  // Effect to select the first unit by default when data loads
  useEffect(() => {
    if (solarUnits.length > 0 && !selectedUnitId) {
      setSelectedUnitId(solarUnits[0]._id);
    }
  }, [solarUnits, selectedUnitId]);

  const selectedUnit = solarUnits.find((unit) => unit._id === selectedUnitId);

  if (isLoadingSolarUnit) {
    return <div>Loading...</div>;
  }

  if (isErrorSolarUnit) {
    if (errorSolarUnit.status === 404) {
      return (
        <main className="mt-4">
          <h1 className="text-4xl font-bold text-foreground">
            {user?.firstName}'s House
          </h1>
          <p className="mt-4">No solar unit found for this user.</p>
        </main>
      );
    }
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
        <h3 className="font-bold text-lg mb-2">Error Loading Solar Unit</h3>
        <p className="mb-2">Status: {errorSolarUnit.status}</p>
        <pre className="text-xs font-mono bg-white p-2 rounded overflow-auto max-h-[300px]">
          {JSON.stringify(errorSolarUnit, null, 2)}
        </pre>
      </div>
    );
  }

  // Fallback if no units found
  if (solarUnits.length === 0) {
    return (
      <main className="mt-4">
        <h1 className="text-4xl font-bold text-foreground">
          {user?.firstName}'s House
        </h1>
        <p className="mt-4">No solar units found for your account.</p>
      </main>
    );
  }

  // Ensure selectedUnit is available before rendering dependant components
  if (!selectedUnit) return null;

  return (
    <main className="mt-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            {user?.firstName}'s House
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back to your Solar Energy Production Dashboard
          </p>
        </div>

        {/* Unit Selector - Only show if multiple units exist or just for consistency */}
        <div className="w-full md:w-[250px]">
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
      </div>

      {/* Row 1: Weather and Real-Time Power */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        <div className="h-full">
          <WeatherWidget solarUnitId={selectedUnit._id} />
        </div>
        <div className="h-full">
          <RealTimePowerCard solarUnit={selectedUnit} />
        </div>
      </div>

      {/* Row 2: Capacity Factor and Data Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[400px]">
          <CapacityFactorChart solarUnitId={selectedUnit._id} />
        </div>
        <div className="lg:col-span-2 h-[400px]">
          <DataChart solarUnitId={selectedUnit._id} />
        </div>
      </div>

      {/* Row 3: System Health */}
      <div className="h-[300px]">
        <DashboardAnomalies solarUnitId={selectedUnit._id} />
      </div>
    </main>
  );
};

export default DashboardPage;
