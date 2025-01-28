ALTER TABLE `courses` MODIFY COLUMN `updated_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `user_courses` MODIFY COLUMN `enrolled_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `user_courses` MODIFY COLUMN `last_updated` timestamp DEFAULT (now());