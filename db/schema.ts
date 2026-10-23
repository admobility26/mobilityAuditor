// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import {sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const responses=sqliteTable('responses',{id:text('id').primaryKey(),payload:text('payload').notNull(),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull()});
