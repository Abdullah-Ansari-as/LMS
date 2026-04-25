import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { createPaymentIntent, updatePaymentStatus } from "../api/paymentApi";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1f2937",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#dc2626",
    },
  },
};

export const CheckoutForm = ({ amount, transactionId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Payment system is not ready. Please refresh and try again.");
      return;
    }

    setLoading(true);
    setError(null);

    let createdPaymentIntentId = null;

    try {
      const paymentIntentData = await createPaymentIntent(transactionId);
      const { clientSecret } = paymentIntentData;
      createdPaymentIntentId = paymentIntentData?.paymentIntentId || null;
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card input is not available.");
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {},
          },
        },
      );

      if (confirmError) {
        throw confirmError;
      }

      if (paymentIntent.status !== "succeeded") {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }

      await updatePaymentStatus({
        transactionId,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amountPKR: amount,
        stripeAmount: paymentIntent.amount,
        currency: paymentIntent.currency,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (paymentError) {
      try {
        if (transactionId) {
          await updatePaymentStatus({
            transactionId,
            paymentIntentId: createdPaymentIntentId,
            status: paymentError?.code === "card_declined"
              ? "requires_payment_method"
              : "failed",
            amountPKR: amount,
          });
        }
      } catch (statusError) {
        console.error("Failed to sync payment failure state:", statusError);
      }

      const message = paymentError?.message?.includes("No such payment_intent")
        || paymentError?.code === "resource_missing"
        ? "Stripe could not find the payment session. This usually means your frontend publishable key and backend secret key are from different Stripe accounts or modes."
        : paymentError?.code === "card_declined"
          ? "Your card was declined. Please try a different card."
          : paymentError?.message || "An error occurred during payment. Please try again.";

      setError(message);

      if (onError) {
        onError(paymentError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Card details
        </label>
        <CardElement options={cardElementOptions} />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#635bff] px-4 py-3 font-medium text-white transition hover:bg-[#564fd8] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Processing..." : `Pay Rs. ${Number(amount || 0).toLocaleString()}`}
      </button>
    </form>
  );
};
