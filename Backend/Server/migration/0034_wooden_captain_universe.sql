ALTER TABLE `completed_lessons` ADD `createdAt` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `completed_lessons` ADD `updated_at` timestamp DEFAULT (now());