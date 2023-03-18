// ./utils/get-stripejs.ts
import { Stripe, loadStripe } from '@stripe/stripe-js';

const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  'pk_test_51MGciKSAVK3qNRELTAKWkzslWNsuXyRS3dK5t0uw3lEUg8Ordk0oadj4nAtscqtXIrPAzjsfCub7Snu9vp2YyTj8006Kjr6Jnp';

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export default getStripe;
