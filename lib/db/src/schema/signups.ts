import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const signupsTable = pgTable("signups", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSignupSchema = createInsertSchema(signupsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertSignup = z.infer<typeof insertSignupSchema>;
export type Signup = typeof signupsTable.$inferSelect;
