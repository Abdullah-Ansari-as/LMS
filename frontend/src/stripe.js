import { loadStripe } from "@stripe/stripe-js";

// export const stripePromise = loadStripe(
//   import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51Sk03zCuXHpZl3JMlrg0WtjRCU8DrZjnneUoy5csxcyo0vElxoiyaJrDwh2nJNUD1wnPgyyzT0JLCeS6n8v8SDx000W8Q1HgNk"
// );
 

// Make sure you're using your publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51Sk03zCuXHpZl3JMlrg0WtjRCU8DrZjnneUoy5csxcyo0vElxoiyaJrDwh2nJNUD1wnPgyyzT0JLCeS6n8v8SDx000W8Q1HgNk"
);

export { stripePromise };