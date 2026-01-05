import { useSearchParams, Link } from "react-router-dom";
import { useGetSessionStatusQuery } from "../../lib/redux/query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PaymentCompletePage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data, isLoading } = useGetSessionStatusQuery(sessionId, {
    skip: !sessionId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg">Verifying payment...</div>
      </div>
    );
  }

  const isSuccess = data?.paymentStatus === "paid";

  return (
    <div className="container mx-auto p-8 max-w-md">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <CardTitle>
            {isSuccess ? "Payment Successful" : "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSuccess ? (
            <>
              <p className="text-muted-foreground">
                Thank you for your payment. Your invoice has been updated.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">Amount Paid</p>
                <p className="text-2xl font-bold">
                  ${(data.amountTotal / 100).toFixed(2)}
                </p>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">
              Something went wrong. Please try again or contact support.
            </p>
          )}

          <Button asChild className="w-full">
            <Link to="/dashboard/invoices">Return to Invoices</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
