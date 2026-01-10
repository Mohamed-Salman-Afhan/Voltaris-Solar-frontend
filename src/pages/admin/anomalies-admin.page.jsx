import React, { useState } from "react";
import { useGetAdminAnomaliesQuery } from "@/lib/redux/query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, TriangleAlert } from "lucide-react";

const AdminAnomaliesPage = () => {
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [page, setPage] = useState(1);

  const queryParams = { page, limit: 10 };
  if (filterSeverity !== "ALL") queryParams.severity = filterSeverity;
  if (filterStatus !== "ALL") queryParams.status = filterStatus;

  const { data: response, isLoading } = useGetAdminAnomaliesQuery(queryParams);
  const anomalies = response?.data || [];
  const meta = response?.meta || { totalPages: 1, currentPage: 1 };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "destructive";
      case "WARNING":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "NEW":
        return "destructive";
      case "ACKNOWLEDGED":
        return "secondary";
      case "RESOLVED":
        return "outline";
      default:
        return "outline";
    }
  };

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1); // Reset to page 1 on filter change
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            System Anomalies
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage anomalies across all solar units.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="flex gap-4 p-4">
          <Select
            value={filterSeverity}
            onValueChange={handleFilterChange(setFilterSeverity)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Severities</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterStatus}
            onValueChange={handleFilterChange(setFilterStatus)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="ACKNOWLEDGED">Acknowledged</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="border-b bg-muted/30 px-6 py-4 rounded-t-md">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TriangleAlert className="h-5 w-5 text-destructive" />
            <span>Detected Issues</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <span>Loading anomalies...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Unit ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Metrics</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {anomalies.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center h-24 text-muted-foreground"
                      >
                        No anomalies found matching criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    anomalies.map((anomaly, idx) => (
                      <TableRow
                        key={anomaly._id}
                        className={
                          idx % 2 === 0
                            ? "bg-background hover:bg-muted/40"
                            : "bg-muted/20 hover:bg-muted/40"
                        }
                      >
                        <TableCell className="font-medium whitespace-nowrap">
                          {format(new Date(anomaly.detectionTimestamp), "PP p")}
                        </TableCell>
                        <TableCell className="font-mono text-xs whitespace-nowrap">
                          {anomaly.solarUnitId?.serialNumber ||
                            anomaly.solarUnitId ||
                            "N/A"}
                        </TableCell>
                        <TableCell className="capitalize whitespace-nowrap">
                          {anomaly.anomalyType.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getSeverityColor(anomaly.severity)}
                            className="uppercase"
                          >
                            {anomaly.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          <span className="text-muted-foreground">Exp:</span>{" "}
                          {anomaly.metrics.expectedValue} |{" "}
                          <span className="text-muted-foreground">Act:</span>{" "}
                          {anomaly.metrics.actualValue}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="uppercase">
                            {anomaly.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">
                  Page {meta.currentPage} of {meta.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={meta.currentPage <= 1}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={meta.currentPage >= meta.totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnomaliesPage;
