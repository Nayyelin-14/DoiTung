ALTER TABLE `users` MODIFY COLUMN `user_password` varchar(365) NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `category` varchar(225) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_courses` ADD `is_completed` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `user_courses` ADD `progress` float DEFAULT 0;--> statement-breakpoint
ALTER TABLE `user_courses` ADD `enrolled_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `user_courses` ADD `last_updated` timestamp DEFAULT null;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `isCompleted`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `progress`;