import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const serviceRequestsTable = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  serviceSlug: text("service_slug").notNull(),
  serviceTitle: text("service_title").notNull(),
  purchaserName: text("purchaser_name").notNull(),
  purchaserEmail: text("purchaser_email").notNull(),
  purchaserPhone: text("purchaser_phone").notNull(),
  purchaserCompany: text("purchaser_company"),
  projectAddress: text("project_address").notNull(),
  projectDescription: text("project_description").notNull(),
  estimatedBudget: integer("estimated_budget"),
  startDate: text("start_date"),
  contractTermsAccepted: boolean("contract_terms_accepted")
    .notNull()
    .default(false),
  status: text("status").notNull().default("new"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type ServiceRequest = typeof serviceRequestsTable.$inferSelect;
