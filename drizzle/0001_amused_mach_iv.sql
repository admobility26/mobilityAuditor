CREATE TABLE `fleet_records` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`vehicle_id` text,
	`payload` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
