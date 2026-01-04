import { useGetSolarUnitForUserQuery } from "@/lib/redux/query";
import DataChart from "./components/DataChart";
import WeatherWidget from "./components/WeatherWidget";
import CapacityFactorChart from "./components/CapacityFactorChart";
import RealTimePowerCard from "./components/RealTimePowerCard";
import { useUser } from "@clerk/clerk-react";

const DashboardPage = () => {
  const { user, isLoaded } = useUser();

  const {
    data: solarUnit,
    isLoading: isLoadingSolarUnit,
    isError: isErrorSolarUnit,
    error: errorSolarUnit,
  } = useGetSolarUnitForUserQuery();

  if (isLoadingSolarUnit) {
    return <div>Loading...</div>;
  }

  if (isErrorSolarUnit) {
    return <div>Error: {errorSolarUnit.message}</div>;
  }

  return (
    <main className="mt-4 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">
          {user?.firstName}'s House
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back to your Solar Energy Production Dashboard
        </p>
      </div>

      {/* Row 1: Weather and Real-Time Power */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        <div className="h-full">
          <WeatherWidget solarUnitId={solarUnit._id} />
        </div>
        <div className="h-full">
          <RealTimePowerCard solarUnit={solarUnit} />
        </div>
      </div>

      {/* Row 2: Capacity Factor and Data Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[400px]">
          <CapacityFactorChart solarUnitId={solarUnit._id} />
        </div>
        <div className="lg:col-span-2 h-[400px]">
          <DataChart solarUnitId={solarUnit._id} />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
