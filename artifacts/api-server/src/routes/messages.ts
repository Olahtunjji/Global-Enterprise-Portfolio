import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import {
  db,
  messagesTable,
  serviceRequestsTable,
  auditLogTable,
} from "@workspace/db";
import {
  ListMessagesQueryParams,
  ListMessagesResponse,
  CreateMessageBody,
} from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

function serialize(m: typeof messagesTable.$inferSelect) {
  return {
    id: m.id,
    serviceRequestId: m.serviceRequestId,
    direction: m.direction as "inbound" | "outbound",
    subject: m.subject,
    body: m.body,
    recipientEmail: m.recipientEmail,
    createdAt: m.createdAt.toISOString(),
  };
}

router.get("/messages", requireAuth, async (req, res): Promise<void> => {
  const parsed = ListMessagesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const id = parsed.data.serviceRequestId;
  const baseQuery = db.select().from(messagesTable);
  const rows = await (id
    ? baseQuery.where(eq(messagesTable.serviceRequestId, id))
    : baseQuery
  ).orderBy(desc(messagesTable.createdAt));
  res.json(ListMessagesResponse.parse(rows.map(serialize)));
});

router.post("/messages", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { serviceRequestId, subject, body } = parsed.data;
  const [request] = await db
    .select()
    .from(serviceRequestsTable)
    .where(eq(serviceRequestsTable.id, serviceRequestId));
  if (!request) {
    res.status(404).json({ error: "Service request not found" });
    return;
  }

  const [row] = await db
    .insert(messagesTable)
    .values({
      serviceRequestId,
      direction: "outbound",
      subject,
      body,
      recipientEmail: request.purchaserEmail,
    })
    .returning();

  await db.insert(auditLogTable).values({
    action: "message.sent",
    entityType: "message",
    entityId: row.id,
    actor: "admin",
    details: `Sent "${subject}" to ${request.purchaserEmail}`,
  });

  res.status(201).json(serialize(row));
});

export default router;
