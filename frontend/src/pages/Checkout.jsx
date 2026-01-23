import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/success",
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-10 mt-20">
      <PaymentElement />
      <button disabled={!stripe}>Pay Now</button>
    </form>
  );
};

export default Checkout;
