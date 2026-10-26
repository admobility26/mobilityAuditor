// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import {sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const responses=sqliteTable('responses',{id:text('id').primaryKey(),payload:text('payload').notNull(),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull()});
export const fleetRecords=sqliteTable('fleet_records',{id:text('id').primaryKey(),kind:text('kind').notNull(),vehicleId:text('vehicle_id'),payload:text('payload').notNull(),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull()});
export const auditReports=sqliteTable('audit_reports',{id:text('id').primaryKey(),payload:text('payload').notNull(),createdAt:text('created_at').notNull()});
export const trainingRecords=sqliteTable('training_records',{id:text('id').primaryKey(),payload:text('payload').notNull(),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull()});
export const trainingCourses=sqliteTable('training_courses',{id:text('id').primaryKey(),payload:text('payload').notNull(),updatedAt:text('updated_at').notNull()});
export const trainingResources=sqliteTable('training_resources',{id:text('id').primaryKey(),payload:text('payload').notNull(),createdAt:text('created_at').notNull()});
export const trainingResourceUploads=sqliteTable('training_resource_uploads',{id:text('id').primaryKey(),payload:text('payload').notNull(),createdAt:text('created_at').notNull()});
