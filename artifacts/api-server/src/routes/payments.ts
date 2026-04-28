import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import {
  db,
  paymentRequestsTable,
  serviceRequestsTable,
  auditLogTable,
} from "@workspace/db";
import {
  ListPaymentsResponse,
  CreatePaymentRequestBody,
} from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";
import { getStripe } from "../lib/stripe";

const router: IRouter = Router();

function serialize(p: typeof paymentRequestsTable.$inferSelect) {
  return {
    id: p.id,
    serviceRequestId: p.serviceRequestId,
    purchaserName: p.purchaserName,
    purchaserEmail: p.purchaserEmail,
    amountCents: p.amountCents,
    currency: p.currency,
    description: p.description,
    status: p.status as
      | "draft"
      | "sent"
      | "paid"
      | "refunded"
      | "cancelled"
      | "error",
    stripeCheckoutUrl: p.stripeCheckoutUrl,
    stripeSessionId: p.stripeSessionId,
    errorMessage: p.errorMessage,
    createdAt: p.createdAt.toISOString(),
    paidAt: p.paidAt ? p.paidAt.toISOString() : null,
  };
}

router.get("/payments", requireAuth, async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(paymentRequestsTable)
    .orderBy(desc(paymentRequestsTable.createdAt));
  res.json(ListPaymentsResponse.parse(rows.map(serialize)));
});

router.post("/payments", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePaymentRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { serviceRequestId, amountCents, currency, description } = parsed.data;

  const [request] = await db
    .select()
    .from(serviceRequestsTable)
    .where(eq(serviceRequestsTable.id, serviceRequestId));
  if (!request) {
    res.status(404).json({ error: "Service request not found" });
    return;
  }

  const stripe = getStripe();
  let stripeCheckoutUrl: string | null = null;
  let stripeSessionId: string | null = null;
  let status: "draft" | "sent" | "error" = "draft";
  let errorMessage: string | null = null;

  if (!stripe) {
    status = "draft";
    errorMessage =
      "Stripe is not configured. Authorize the Stripe integration to generate live payment links.";
  } else {
    try {
      const origin =
        req.headers.origin?.toString() ||
        `https://${req.headers.host?.toString()}`;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: request.purchaserEmail,
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              unit_amount: amountCents,
              product_data: {
                name: description,
                description: `EMMYFAD Global Enterprise — ${request.serviceTitle}`,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/contact?paid=1`,
        cancel_url: `${origin}/contact?paid=0`,
        metadata: {
          serviceRequestId: String(serviceRequestId),
          purchaserEmail: request.purchaserEmail,
        },
      });
      stripeCheckoutUrl = session.url;
      stripeSessionId = session.id;
      status = "sent";
    } catch (err) {
      req.log.error({ err }, "Failed to create Stripe checkout session");
      status = "error";
      errorMessage =
        err instanceof Error ? err.message : "Stripe error";
    }
  }

  const [row] = await db
    .insert(paymentRequestsTable)
    .values({
      serviceRequestId,
      purchaserName: request.purchaserName,
      purchaserEmail: request.purchaserEmail,
      amountCents,
      currency: currency.toLowerCase(),
      description,
      status,
      stripeCheckoutUrl,
      stripeSessionId,
      errorMessage,
    })
    .returning();

  await db.insert(auditLogTable).values({
    action: status === "error" ? "payment.error" : "payment.created",
    entityType: "payment_request",
    entityId: row.id,
    actor: "admin",
    details: `Payment request for ${request.purchaserEmail}: ${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()} — ${description}${errorMessage ? ` (${errorMessage})` : ""}`,
  });

  res.status(201).json(serialize(row));
});

export default router;
