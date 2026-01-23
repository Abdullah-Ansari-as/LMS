import { loadStripe } from "@stripe/stripe-js";

// Make sure you're using your publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

export { stripePromise };