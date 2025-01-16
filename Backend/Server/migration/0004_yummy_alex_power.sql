ALTER TABLE `courses` ADD `isCompleted` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `courses` ADD `progress` float;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `enrolled_course_id`;