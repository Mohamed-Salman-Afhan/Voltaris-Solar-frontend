import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const AnomalyCard = ({ anomaly, onResolve }) => {
  const {
    anomalyType,
    severity,
    detectionTimestamp,
    description,
    metrics,
    status,
  } = anomaly;

  const getIcon = () => {
    switch (severity) {
      case "CRITICAL":
        return <AlertTriangle className="text-red-500 w-6 h-6" />;
      case "WARNING":
        return <AlertCircle className="text-yellow-500 w-6 h-6" />;
      default:
        return <Info className="text-blue-500 w-6 h-6" />;
    }
  };

  const badgeColor = {
    CRITICAL: "bg-red-100 text-red-800 border-red-200",
    WARNING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    INFO: "bg-blue-100 text-blue-800 border-blue-200",
  }[severity];

  return (
    <Card
      className={`border-l-4 ${
        severity === "CRITICAL"
          ? "border-l-red-500"
          : severity === "WARNING"
          ? "border-l-yellow-500"
          : "border-l-blue-500"
      } shadow-sm bg-white dark:bg-zinc-950`}
    >
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        <div className="flex-grow w-full">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-foreground">
                {anomalyType.replace(/_/g, " ")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(detectionTimestamp), "PPpp")}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}
            >
              {severity}
            </span>
          </div>

          <p className="mt-2 text-foreground/90">{description}</p>

          <div className="mt-3 bg-muted/50 p-3 rounded-md text-sm grid grid-cols-2 gap-2 md:w-2/3">
            <div>
              <span className="text-muted-foreground block">Expected</span>
              <span className="font-mono font-medium text-foreground">
                {metrics.expectedValue} kWh
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Actual</span>
              <span className="font-mono font-medium text-red-600">
                {metrics.actualValue} kWh
              </span>
            </div>
            {metrics.deviationPercent && (
              <div className="col-span-2">
                <span className="text-muted-foreground block">Deviation</span>
                <span className="font-mono font-medium text-foreground">
                  {metrics.deviationPercent}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 self-center md:self-start mt-4 md:mt-0">
          {status === "NEW" && (
            <Button
              onClick={() => onResolve(anomaly._id)}
              size="sm"
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Resolve
            </Button>
          )}
          {status === "RESOLVED" && (
            <div className="text-green-600 flex items-center text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-1" /> Resolved
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyCard;
