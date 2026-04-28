import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const paymentRequestsTable = pgTable("payment_requests", {
  id: serial("id").primaryKey(),
  serviceRequestId: integer("service_request_id").notNull(),
  purchaserName: text("purchaser_name").notNull(),
  purchaserEmail: text("purchaser_email").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("usd"),
  description: text("description").notNull(),
  status: text("status").notNull().default("draft"),
  stripeCheckoutUrl: text("stripe_checkout_url"),
  stripeSessionId: text("stripe_session_id"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export type PaymentRequestRow = typeof paymentRequestsTable.$inferSelect;
