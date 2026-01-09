import React, { useState } from "react";
import { useGetAdminInvoicesQuery } from "@/lib/redux/query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { DollarSign, Clock, AlertCircle } from "lucide-react";

export function AdminInvoicesPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [daysFilter, setDaysFilter] = useState("30");

  // Construct query params
  const queryParams = {
    days: daysFilter,
    ...(statusFilter !== "ALL" && { status: statusFilter }),
  };

  const { data, isLoading, isError } = useGetAdminInvoicesQuery(queryParams);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load invoices.
      </div>
    );
  }

  const { stats, invoices } = data || { stats: {}, invoices: [] };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Invoice Management</h1>
      <p className="text-muted-foreground">
        Monitor revenue and track payment statuses.
      </p>

      {/* Stats Cards */}
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Revenue */}
        <Card>
          <div className="flex flex-row items-center justify-between p-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </span>
              <span className="text-3xl font-bold">
                ${stats.totalRevenue?.toFixed(2) || "0.00"}
              </span>
              <span className="text-xs text-muted-foreground">
                Collected from paid invoices
              </span>
            </div>
            <DollarSign className="h-16 w-16 text-green-600 opacity-90" />
          </div>
        </Card>

        {/* Pending Payments */}
        <Card>
          <div className="flex flex-row items-center justify-between p-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Pending Payments
              </span>
              <span className="text-3xl font-bold">
                ${stats.totalPending?.toFixed(2) || "0.00"}
              </span>
              <span className="text-xs text-muted-foreground">
                Awaiting payment
              </span>
            </div>
            <Clock className="h-16 w-16 text-yellow-600 opacity-90" />
          </div>
        </Card>

        {/* Overdue / Failed */}
        <Card>
          <div className="flex flex-row items-center justify-between p-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Overdue / Failed
              </span>
              <span className="text-3xl font-bold">
                ${stats.totalFailed?.toFixed(2) || "0.00"}
              </span>
              <span className="text-xs text-muted-foreground">
                Requires attention
              </span>
            </div>
            <AlertCircle className="h-16 w-16 text-red-600 opacity-90" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[200px]">
          <Select value={daysFilter} onValueChange={setDaysFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 3 Months</SelectItem>
              <SelectItem value="180">Last 6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell className="font-medium">
                    {invoice._id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>
                        {invoice.user?.firstName} {invoice.user?.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {invoice.user?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{invoice.solarUnit?.serialNumber}</span>
                      <span className="text-xs text-muted-foreground">
                        {invoice.solarUnit?.city}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.billingPeriodStart), "MMM d")} -{" "}
                    {format(new Date(invoice.billingPeriodEnd), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>${invoice.amount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.paymentStatus === "PAID"
                          ? "default"
                          : invoice.paymentStatus === "PENDING"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        invoice.paymentStatus === "PAID"
                          ? "bg-green-500 hover:bg-green-600"
                          : invoice.paymentStatus === "PENDING"
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : ""
                      }
                    >
                      {invoice.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.createdAt), "PPP")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AdminInvoicesPage;
