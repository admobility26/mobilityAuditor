CREATE TABLE `formation_login_limits` (
	`bucket` text PRIMARY KEY NOT NULL,
	`attempts` integer NOT NULL,
	`until_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `formation_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `formation_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'learner' NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`expires_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `formation_users_email_unique` ON `formation_users` (`email`);