CREATE TABLE `user_completed_lessons` (
	`user_id` varchar(225) NOT NULL,
	`course_id` varchar(225) NOT NULL,
	`completed_lessons` json NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now())
);
--> statement-breakpoint
ALTER TABLE `user_completed_lessons` ADD CONSTRAINT `user_completed_lessons_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_completed_lessons` ADD CONSTRAINT `user_completed_lessons_course_id_courses_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;