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
  let color = "bg-green-500/30 text-green-200 border border-green-500/50";
  let icon = <CheckCircle2 className="w-4 h-4 mr-1" />;

  if (level === "Degraded") {
    color = "bg-yellow-500/30 text-yellow-200 border border-yellow-500/50";
    icon = <AlertTriangle className="w-4 h-4 mr-1" />;
  } else if (level === "Poor") {
    color = "bg-red-500/30 text-red-200 border border-red-500/50";
    icon = <AlertCircle className="w-4 h-4 mr-1" />;
  }

  return (
    <div
      className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${color}`}
    >
      {icon}
      {level}
    </div>
  );
};

const WeatherMetric = ({ icon: Icon, label, value, unit }) => (
  <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
    <div className="p-2 bg-white/20 rounded-lg text-white">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xl font-bold text-white">
        {value}{" "}
        <span className="text-sm font-normal text-white/80">{unit}</span>
      </p>
      <p className="text-xs text-white/60 uppercase tracking-wider">{label}</p>
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

        <div className="grid grid-cols-2 gap-4">
          <Card className="col-span-1 border-0 bg-transparent shadow-none">
            <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <Thermometer className="w-8 h-8 text-white" />
              <div>
                <div className="text-3xl font-bold text-white">
                  {temperature}°C
                </div>
                <div className="text-white/80 text-sm">Temperature</div>
              </div>
            </div>
          </Card>
          <Card className="col-span-1 border-0 bg-transparent shadow-none">
            <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <Wind className="w-8 h-8 text-white" />
              <div>
                <div className="text-3xl font-bold text-white">
                  {windspeed} m/s
                </div>
                <div className="text-white/80 text-sm">Wind Speed</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Since the user asked for 4 columns in the PRD but the image example shows big cards... 
            PRD: "4-column card grid layout... Card size: 250px width, 180px height"
            The mock image shows 2 big rows/cards inside the weather widget? 
            Wait, Reference Image 1 has:
            "12°C Temperature" | "8.5 m/s Wind Speed"
            It only shows 2 metrics in that screenshot.
            But PRD 3.1 says: "Display metrics: Temperature, Cloud Cover, Wind Speed, Solar Radiation".
            I will try to fit all 4. 2x2 grid is better for "Widget" space.
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Already showed Temp and Wind above based on design. 
                   Let's condense or list all 4 uniformly to match PRD "4-column card grid".
                   Actually, let's stick to the PRD requirement "4-column card grid layout" 
                   but inside the widget container? 
                   The PRD describes "UI Component" to HAVE 4 columns.
                   Let's do a row of 4 metrics.
               */}
        </div>

        {/* Re-doing the layout to match PRD "4-column card grid" strictly, 
            but kept inside the main "Weather Integration Component". 
            Let's use the design from the image (glassmorphism) but with 4 metrics.
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <WeatherMetric
            icon={Thermometer}
            label="Temperature"
            value={temperature}
            unit="°C"
          />
          <WeatherMetric
            icon={Cloud}
            label="Cloud Cover"
            value={cloudcover}
            unit="%"
          />
          <WeatherMetric
            icon={Wind}
            label="Wind Speed"
            value={windspeed}
            unit="m/s"
          />
          <WeatherMetric
            icon={Sun}
            label="Radiation"
            value={shortwave_radiation}
            unit="W/m²"
          />
        </div>
        <div className="flex justify-end mt-2">
          <span className="text-[10px] text-white/60">
            Updated: {new Date(timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
