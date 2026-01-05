import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useAuth } from "@clerk/clerk-react";

// Initialize Stripe ONCE, outside component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutForm({ invoiceId }) {
  const { getToken } = useAuth();

  const fetchClientSecret = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        "http://localhost:8000/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ invoiceId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error("Error creating payment session:", error);
      throw error;
    }
  }, [invoiceId, getToken]);

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
