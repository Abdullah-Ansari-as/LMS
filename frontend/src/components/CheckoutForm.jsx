import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { createPaymentIntent, updatePaymentStatus } from "../api/paymentApi";

export const CheckoutForm = ({ amount, transactionId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Payment system is not ready. Please refresh and try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create payment intent using your API function
      console.log("Creating payment intent...");
      const paymentIntentData = await createPaymentIntent(amount, transactionId);
      
      console.log("Payment intent created:", paymentIntentData);
      setPaymentData(paymentIntentData);

      const { clientSecret } = paymentIntentData;

      // 2. Get card element
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // 3. Confirm the payment
      console.log("Confirming payment...");
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              // You can add customer details here
            }
          }
        }
      );

      if (confirmError) {
        console.error("Confirmation error:", confirmError);
        throw confirmError;
      }

      console.log("Payment confirmed:", paymentIntent);

      if (paymentIntent.status === "succeeded") {
        setPaymentCompleted(true);

        // 4. Update payment status in your backend
        try {
          await updatePaymentStatus({
            transactionId: transactionId,
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
            amountPKR: amount,
            stripeAmount: paymentIntent.amount,
            currency: paymentIntent.currency
          });
        } catch (updateError) {
          console.error("Status update error:", updateError);
          // Don't block success message for user
        }

        // 5. Call success callback
        if (onSuccess) {
          setTimeout(() => onSuccess(), 2000);
        }
      } else {
        setError(`Payment status: ${paymentIntent.status}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      
      // Handle specific error messages
      if (error.message?.includes("No such payment_intent")) {
        setError("Payment session expired. Please try again.");
      } else if (error.code === "card_declined") {
        setError("Your card was declined. Please try a different card.");
      } else {
        setError(error.message || "An error occurred during payment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains the same...
};