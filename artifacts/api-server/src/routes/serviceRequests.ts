import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import {
  db,
  serviceRequestsTable,
  servicesTable,
  messagesTable,
  paymentRequestsTable,
  auditLogTable,
} from "@workspace/db";
import {
  CreateServiceRequestBody,
  ListServiceRequestsQueryParams,
  ListServiceRequestsResponse,
  GetServiceRequestParams,
  GetServiceRequestResponse,
  UpdateServiceRequestParams,
  UpdateServiceRequestBody,
  UpdateServiceRequestResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

function serializeRequest(r: typeof serviceRequestsTable.$inferSelect) {
  return {
    id: r.id,
    serviceSlug: r.serviceSlug,
    serviceTitle: r.serviceTitle,
    purchaserName: r.purchaserName,
    purchaserEmail: r.purchaserEmail,
    purchaserPhone: r.purchaserPhone,
    purchaserCompany: r.purchaserCompany,
    projectAddress: r.projectAddress,
    projectDescription: r.projectDescription,
    estimatedBudget: r.estimatedBudget,
    startDate: r.startDate,
    contractTermsAccepted: r.contractTermsAccepted,
    status: r.status,
    adminNotes: r.adminNotes,
    createdAt: r.createdAt.toISOString(),
  };
}

router.post("/service-requests", async (req, res): Promise<void> => {
  const parsed = CreateServiceRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  if (!data.contractTermsAccepted) {
    res.status(400).json({ error: "Contract terms must be accepted" });
    return;
  }

  const [service] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.slug, data.serviceSlug));
  if (!service) {
    res.status(400).json({ error: "Unknown service" });
    return;
  }

  const [row] = await db
    .insert(serviceRequestsTable)
    .values({
      serviceSlug: data.serviceSlug,
      serviceTitle: service.title,
      purchaserName: data.purchaserName,
      purchaserEmail: data.purchaserEmail,
      purchaserPhone: data.purchaserPhone,
      purchaserCompany: data.purchaserCompany ?? null,
      projectAddress: data.projectAddress,
      projectDescription: data.projectDescription,
      estimatedBudget: data.estimatedBudget ?? null,
      startDate: data.startDate ?? null,
      contractTermsAccepted: data.contractTermsAccepted,
      status: "new",
    })
    .returning();

  await db.insert(auditLogTable).values({
    action: "service_request.created",
    entityType: "service_request",
    entityId: row.id,
    actor: data.purchaserEmail,
    details: `New ${service.title} request from ${data.purchaserName}`,
  });

  res.status(201).json(serializeRequest(row));
});

router.get(
  "/service-requests",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = ListServiceRequestsQueryParams.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const status = parsed.data.status;
    const baseQuery = db.select().from(serviceRequestsTable);
    const rows = await (status
      ? baseQuery.where(eq(serviceRequestsTable.status, status))
      : baseQuery
    ).orderBy(desc(serviceRequestsTable.createdAt));
    res.json(ListServiceRequestsResponse.parse(rows.map(serializeRequest)));
  },
);

router.get(
  "/service-requests/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = GetServiceRequestParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [row] = await db
      .select()
      .from(serviceRequestsTable)
      .where(eq(serviceRequestsTable.id, params.data.id));
    if (!row) {
      res.status(404).json({ error: "Service request not found" });
      return;
    }
    const messages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.serviceRequestId, row.id))
      .orderBy(desc(messagesTable.createdAt));
    const payments = await db
      .select()
      .from(paymentRequestsTable)
      .where(eq(paymentRequestsTable.serviceRequestId, row.id))
      .orderBy(desc(paymentRequestsTable.createdAt));

    res.json(
      GetServiceRequestResponse.parse({
        request: serializeRequest(row),
        messages: messages.map((m) => ({
          id: m.id,
          serviceRequestId: m.serviceRequestId,
          direction: m.direction as "inbound" | "outbound",
          subject: m.subject,
          body: m.body,
          recipientEmail: m.recipientEmail,
          createdAt: m.createdAt.toISOString(),
        })),
        payments: payments.map((p) => ({
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
        })),
      }),
    );
  },
);

router.patch(
  "/service-requests/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = UpdateServiceRequestParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdateServiceRequestBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const updates: Partial<typeof serviceRequestsTable.$inferInsert> = {};
    if (parsed.data.status) updates.status = parsed.data.status;
    if (parsed.data.adminNotes !== undefined)
      updates.adminNotes = parsed.data.adminNotes;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No updates provided" });
      return;
    }

    const [row] = await db
      .update(serviceRequestsTable)
      .set(updates)
      .where(eq(serviceRequestsTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Service request not found" });
      return;
    }

    await db.insert(auditLogTable).values({
      action: "service_request.updated",
      entityType: "service_request",
      entityId: row.id,
      actor: "admin",
      details: `Updated to status=${row.status}`,
    });

    res.json(UpdateServiceRequestResponse.parse(serializeRequest(row)));
  },
);

export default router;
