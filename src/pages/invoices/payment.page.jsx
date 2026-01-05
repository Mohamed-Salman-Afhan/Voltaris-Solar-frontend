import { useParams } from "react-router-dom";
import CheckoutForm from "./components/CheckoutForm";
import { Card, CardContent } from "../../components/ui/card";

export default function PaymentPage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Secure Payment</h1>
      <Card>
        <CardContent className="p-6">
          <CheckoutForm invoiceId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
