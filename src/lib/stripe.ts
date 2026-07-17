import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

/**
 * Lazy-loads Stripe and initializes it with the publishable key from environment variables.
 * @returns A promise that resolves to the Stripe instance or null if the key is missing.
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn('VITE_STRIPE_PUBLISHABLE_KEY is missing. Stripe frontend integrations will be disabled.');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

/**
 * Initiates a Stripe Checkout session by calling the backend and redirecting the user.
 * @param priceId - The Stripe Price ID (optional, preferred for standard flows)
 * @param options - Additional options like serviceId or email
 */
export async function checkout(priceId: string, options?: { serviceId?: string; email?: string }) {
  const stripe = await getStripe();
  if (!stripe) {
    console.error('Stripe failed to initialize.');
    return;
  }

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        priceId,
        email: options?.email,
        serviceId: options?.serviceId
      }),
    });

    const session = await response.json();
    
    if (session.error) {
      throw new Error(session.error);
    }

    if (session.url) {
      window.location.href = session.url;
    } else if (session.sessionId) {
      const result = await (stripe as any).redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    }
  } catch (error) {
    console.error('Checkout failed:', error);
    throw error;
  }
}
