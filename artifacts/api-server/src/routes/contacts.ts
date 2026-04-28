import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, serviceRequestsTable } from "@workspace/db";
import { ListContactsResponse } from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

router.get("/contacts", requireAuth, async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      email: serviceRequestsTable.purchaserEmail,
      name: sql<string>`max(${serviceRequestsTable.purchaserName})`.as("name"),
      phone: sql<string>`max(${serviceRequestsTable.purchaserPhone})`.as("phone"),
      company: sql<string | null>`max(${serviceRequestsTable.purchaserCompany})`.as(
        "company",
      ),
      requestCount: sql<number>`count(*)::int`.as("request_count"),
      lastContactAt: sql<Date>`max(${serviceRequestsTable.createdAt})`.as(
        "last_contact_at",
      ),
    })
    .from(serviceRequestsTable)
    .groupBy(serviceRequestsTable.purchaserEmail);

  res.json(
    ListContactsResponse.parse(
      rows.map((r) => ({
        email: r.email,
        name: r.name,
        phone: r.phone,
        company: r.company,
        requestCount: r.requestCount,
        lastContactAt:
          r.lastContactAt instanceof Date
            ? r.lastContactAt.toISOString()
            : new Date(r.lastContactAt).toISOString(),
      })),
    ),
  );
});

export default router;
