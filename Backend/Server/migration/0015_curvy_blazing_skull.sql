ALTER TABLE `courses` RENAME COLUMN `created_at` TO `createdAt`;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `createdAt` timestamp DEFAULT (now());