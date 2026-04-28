import { Router, type IRouter } from "express";
import { sql, desc, eq } from "drizzle-orm";
import {
  db,
  serviceRequestsTable,
  messagesTable,
  paymentRequestsTable,
  auditLogTable,
} from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  ListAuditLogResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

router.get(
  "/dashboard/summary",
  requireAuth,
  async (_req, res): Promise<void> => {
    const totalsRow = await db
      .select({
        total: sql<number>`count(*)::int`,
        newCount: sql<number>`count(*) filter (where status = 'new')::int`,
        active:
          sql<number>`count(*) filter (where status in ('reviewing','contracted'))::int`,
        completed:
          sql<number>`count(*) filter (where status = 'completed')::int`,
      })
      .from(serviceRequestsTable);

    const [contactsRow] = await db
      .select({
        c: sql<number>`count(distinct ${serviceRequestsTable.purchaserEmail})::int`,
      })
      .from(serviceRequestsTable);

    const [messagesRow] = await db
      .select({
        total: sql<number>`count(*)::int`,
        unreadOutbound:
          sql<number>`count(*) filter (where direction = 'outbound')::int`,
      })
      .from(messagesTable);

    const [paymentsRow] = await db
      .select({
        revenue:
          sql<number>`coalesce(sum(amount_cents) filter (where status = 'paid'),0)::int`,
        pending:
          sql<number>`coalesce(sum(amount_cents) filter (where status in ('draft','sent')),0)::int`,
      })
      .from(paymentRequestsTable);

    const revenueByService = await db
      .select({
        serviceSlug: serviceRequestsTable.serviceSlug,
        serviceTitle: serviceRequestsTable.serviceTitle,
        amountCents:
          sql<number>`coalesce(sum(${paymentRequestsTable.amountCents}) filter (where ${paymentRequestsTable.status} = 'paid'),0)::int`,
        count: sql<number>`count(${paymentRequestsTable.id})::int`,
      })
      .from(paymentRequestsTable)
      .innerJoin(
        serviceRequestsTable,
        eq(paymentRequestsTable.serviceRequestId, serviceRequestsTable.id),
      )
      .groupBy(
        serviceRequestsTable.serviceSlug,
        serviceRequestsTable.serviceTitle,
      );

    const recent = await db
      .select()
      .from(serviceRequestsTable)
      .orderBy(desc(serviceRequestsTable.createdAt))
      .limit(5);

    res.json(
      GetDashboardSummaryResponse.parse({
        totalRequests: totalsRow[0]?.total ?? 0,
        newRequests: totalsRow[0]?.newCount ?? 0,
        activeContracts: totalsRow[0]?.active ?? 0,
        completedContracts: totalsRow[0]?.completed ?? 0,
        totalContacts: contactsRow?.c ?? 0,
        totalMessages: messagesRow?.total ?? 0,
        unreadOutbound: messagesRow?.unreadOutbound ?? 0,
        revenueCents: paymentsRow?.revenue ?? 0,
        pendingPaymentCents: paymentsRow?.pending ?? 0,
        revenueByService,
        recentRequests: recent.map((r) => ({
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
        })),
      }),
    );
  },
);

router.get(
  "/dashboard/audit-log",
  requireAuth,
  async (_req, res): Promise<void> => {
    const rows = await db
      .select()
      .from(auditLogTable)
      .orderBy(desc(auditLogTable.createdAt))
      .limit(200);
    res.json(
      ListAuditLogResponse.parse(
        rows.map((r) => ({
          id: r.id,
          action: r.action,
          entityType: r.entityType,
          entityId: r.entityId,
          actor: r.actor,
          details: r.details,
          createdAt: r.createdAt.toISOString(),
        })),
      ),
    );
  },
);

export default router;
