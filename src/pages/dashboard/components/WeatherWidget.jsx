import React from "react";
import { useGetWeatherQuery } from "@/lib/redux/query";
import {
  Cloud,
  Sun,
  Thermometer,
  Wind,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ImpactBadge = ({ level }) => {
  let color = "bg-emerald-500/20 text-emerald-100 border-emerald-400/30";
  let icon = <CheckCircle2 className="w-4 h-4 mr-1.5" />;

  if (level === "Degraded") {
    color = "bg-amber-500/20 text-amber-100 border-amber-400/30";
    icon = <AlertTriangle className="w-4 h-4 mr-1.5" />;
  } else if (level === "Poor") {
    color = "bg-rose-500/20 text-rose-100 border-rose-400/30";
    icon = <AlertCircle className="w-4 h-4 mr-1.5" />;
  }

  return (
    <div
      className={`flex items-center px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md border ${color} shadow-sm`}
    >
      {icon}
      {level === "Optimal" ? "Normal" : level}
    </div>
  );
};

const WeatherMetric = ({ icon: Icon, label, value, unit, large }) => (
  <div
    className={`flex items-center space-x-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl transition-all hover:bg-white/15 ${
      large ? "p-6" : "p-4"
    }`}
  >
    <div
      className={`rounded-xl flex items-center justify-center text-white bg-white/20 ${
        large ? "p-3" : "p-2"
      }`}
    >
      <Icon className={large ? "w-8 h-8" : "w-5 h-5"} />
    </div>
    <div>
      <p
        className={`font-bold text-white tracking-tight ${
          large ? "text-3xl" : "text-xl"
        }`}
      >
        {value}{" "}
        <span className="text-base font-medium text-white/70">{unit}</span>
      </p>
      <p className="text-xs text-white/60 font-medium uppercase tracking-wider mt-0.5">
        {label}
      </p>
    </div>
  </div>
);

const WeatherWidget = ({ solarUnitId }) => {
  // Polling every 10 minutes (600000 ms)
  const {
    data: response,
    isLoading,
    isError,
  } = useGetWeatherQuery(solarUnitId, {
    pollingInterval: 600000,
    skip: !solarUnitId,
  });

  if (!solarUnitId) return null;

  if (isLoading) {
    return <Skeleton className="w-full h-[250px] rounded-xl" />;
  }

  if (isError || !response?.success) {
    return (
      <Card className="h-full border-red-200 bg-red-50">
        <CardContent className="flex items-center justify-center h-[200px] text-red-500">
          Weather data unavailable
        </CardContent>
      </Card>
    );
  }

  const {
    temperature,
    cloudcover,
    windspeed,
    shortwave_radiation,
    impact_level,
    timestamp,
    city,
    country,
  } = response.data;

  return (
    <div
      className="relative w-full h-full flex flex-col justify-between overflow-hidden rounded-xl shadow-xl"
      style={{
        // Placeholder for the solar farm image. User should replace this URL.
        backgroundImage:
          "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white tracking-tight">
            Weather Conditions
          </h3>
          <ImpactBadge level={impact_level} />
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1 content-center">
          <WeatherMetric
            icon={Thermometer}
            label="Temperature"
            value={temperature}
            unit="°C"
            large
          />
          <WeatherMetric
            icon={Wind}
            label="Wind Speed"
            value={windspeed}
            unit="m/s"
            large
          />
          <WeatherMetric
            icon={Cloud}
            label="Cloud Cover"
            value={cloudcover}
            unit="%"
          />
          <WeatherMetric
            icon={Sun}
            label="Radiation"
            value={shortwave_radiation}
            unit="W/m²"
          />
        </div>
        <div className="flex justify-between mt-2 items-center px-1">
          <span className="text-[10px] text-white/60 font-medium">
            {[city, country].filter(Boolean).join(", ")}
          </span>
          <span className="text-[10px] text-white/60">
            Updated: {new Date(timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
