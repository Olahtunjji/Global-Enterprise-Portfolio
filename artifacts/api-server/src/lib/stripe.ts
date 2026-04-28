import Stripe from "stripe";
import { logger } from "./logger";

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    logger.warn("STRIPE_SECRET_KEY not set — Stripe payment features disabled");
    return null;
  }
  cached = new Stripe(key);
  return cached;
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}
