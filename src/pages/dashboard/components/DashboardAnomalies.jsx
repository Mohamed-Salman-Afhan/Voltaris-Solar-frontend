import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useGetAnomaliesQuery } from "@/lib/redux/query";
import { AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const DashboardAnomalies = ({ solarUnitId }) => {
  const {
    data: anomalies,
    isLoading,
    isError,
  } = useGetAnomaliesQuery(
    {
      unitId: solarUnitId,
      status: "OPEN",
    },
    {
      skip: !solarUnitId,
      pollingInterval: 30000,
    }
  );

  if (isLoading) {
    return (
      <Card className="h-full shadow-lg border-none bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="h-full shadow-lg border-red-200 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/30">
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error Loading Anomalies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600 dark:text-red-300">
            Could not fetch anomaly data for this unit.
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasAnomalies = anomalies && anomalies.length > 0;

  return (
    <Card className="h-full shadow-lg border-none bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-primary tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              System Health
            </CardTitle>
            <CardDescription>
              Active anomalies and system alerts
            </CardDescription>
          </div>
          {hasAnomalies ? (
            <Badge variant="destructive" className="animate-pulse">
              {anomalies.length} Issue{anomalies.length > 1 ? "s" : ""} Pattern
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
            >
              Healthy
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 pt-4">
        {!hasAnomalies ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-3 opacity-60">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                All Systems Normal
              </p>
              <p className="text-sm text-muted-foreground">
                No performance anomalies detected in the last 24 hours.
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-3">
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly._id}
                  className="flex flex-col gap-2 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors border-l-4 border-l-red-500"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-sm line-clamp-1">
                      {anomaly.type || "Unknown Issue"}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                      {format(new Date(anomaly.timestamp), "MMM d, HH:mm")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {anomaly.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-5 px-1.5 uppercase tracking-wide"
                    >
                      {anomaly.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardAnomalies;
