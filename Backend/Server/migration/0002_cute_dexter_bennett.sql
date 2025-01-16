ALTER TABLE `courses` ADD `course_image_url` varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `instructor_name` varchar(225) NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `rating` float DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `is_popular` boolean DEFAULT false NOT NULL;