import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const CheckoutForm = ({ amount, transactionId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError("Payment system is not ready. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Create Payment Intent
      const res = await fetch("http://localhost:3000/api/payments/createPaymentIntent", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          amount: Math.round(parseFloat(amount) * 100), // Convert to cents
          transactionId: transactionId 
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || "Payment failed to initialize");
      }

      // Check if clientSecret exists
      if (!data.clientSecret) {
        throw new Error("No client secret received from server");
      }

      const { clientSecret } = data;

      // 2️⃣ Get Card Element
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // 3️⃣ Confirm Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        // Handle specific error types
        if (result.error.type === "card_error" || result.error.type === "validation_error") {
          setError(result.error.message);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        console.error("Stripe error:", result.error);
      } else if (result.paymentIntent.status === "succeeded") {
        // Payment successful
        setPaymentCompleted(true);
        
        // Update payment status in your backend
        try {
          await updatePaymentStatus(transactionId, result.paymentIntent);
        } catch (updateError) {
          console.error("Failed to update payment status:", updateError);
          // Don't fail the whole process if update fails
        }
        
        // Call the success callback
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError("Payment status is: " + result.paymentIntent.status);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "An error occurred during payment");
    } finally {
      setLoading(false);
    }
  };

  // Function to update payment status in your backend
  const updatePaymentStatus = async (transactionId, paymentIntent) => {
    try {
      const response = await fetch("http://localhost:3000/api/payments/update-status", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: transactionId,
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100, // Convert back from cents
          currency: paymentIntent.currency
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update payment status");
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  if (paymentCompleted) {
    return (
      <div className="text-center py-4">
        <div className="text-green-500 text-4xl mb-3">✓</div>
        <p className="text-lg font-semibold text-gray-800 mb-2">Payment Successful!</p>
        <p className="text-gray-600">Thank you for your payment.</p>
        <p className="text-sm text-gray-500 mt-2">You can now close this window.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
          <strong>Error: </strong>{error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Card Details
        </label>
        <div className="border rounded-lg p-3 bg-white shadow-sm">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                  padding: '10px 12px',
                },
                invalid: {
                  color: '#9e2146',
                  iconColor: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
        <p className="text-xs text-gray-500">
          your Card: XXXX XXXX XXXX XXXX | Exp: MM/YY | CVC: XXX
        </p>
      </div>
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#716ACA] text-white py-3 px-4 rounded-md hover:bg-[#5e56b7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay Rs. ${amount}`
        )}
      </button>
      
      <div className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We don't store your card details.
      </div>
    </form>
  );
};

export default CheckoutForm;