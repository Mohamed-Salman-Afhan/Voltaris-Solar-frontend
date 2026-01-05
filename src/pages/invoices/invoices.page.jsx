import { Link } from "react-router-dom";
import { useGetInvoicesQuery } from "../../lib/redux/query";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export default function InvoicesPage() {
  const { data: invoices, isLoading, error } = useGetInvoicesQuery();

  if (isLoading) return <div className="p-8">Loading invoices...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error loading invoices</div>;

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>

      {invoices?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No invoices found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {invoices.map((invoice) => (
            <Card key={invoice._id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {format(new Date(invoice.billingPeriodStart), "MMMM yyyy")}
                </CardTitle>
                <Badge
                  variant={
                    invoice.paymentStatus === "PAID" ? "default" : "destructive"
                  }
                >
                  {invoice.paymentStatus}
                </Badge>
              </CardHeader>
              <CardContent className="mt-4 flex-1 space-y-2">
                <div className="text-2xl font-bold">
                  {(invoice.totalEnergyGenerated * 0.05).toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "USD",
                    }
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {invoice.totalEnergyGenerated.toFixed(1)} kWh @ $0.05/kWh
                </p>
                <p className="text-xs text-muted-foreground">
                  Unit: {invoice.solarUnitId?.serialNumber || "Unknown"}
                </p>

                <div className="pt-4">
                  {invoice.paymentStatus === "PENDING" ? (
                    <Button asChild className="w-full">
                      <Link to={`/dashboard/invoices/${invoice._id}/pay`}>
                        Pay Now
                      </Link>
                    </Button>
                  ) : (
                    <div className="text-xs text-green-600 font-medium text-center py-2">
                      Paid on {format(new Date(invoice.paidAt), "PP")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
