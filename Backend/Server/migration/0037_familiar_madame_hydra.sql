ALTER TABLE `courses` MODIFY COLUMN `course_description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `overview` text NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `about_instructor` text NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `rating` float;--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `is_popular` boolean;