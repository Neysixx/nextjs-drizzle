import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

// Types for TypeScript
export type User = InferModel<typeof usersTable>;
export type NewUser = InferModel<typeof usersTable, "insert">;

// Export all tables
export const schema = { usersTable };
