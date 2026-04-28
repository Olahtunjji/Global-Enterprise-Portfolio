import {
  pgTable,
  serial,
  text,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const businessProfileTable = pgTable("business_profile", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  ownerName: text("owner_name").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  nin: text("nin").notNull(),
  sex: text("sex").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  bio: text("bio").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
});

export type BusinessProfile = typeof businessProfileTable.$inferSelect;
