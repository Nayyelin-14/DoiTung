CREATE TABLE `saved_courses` (
	`user_id` varchar(255) NOT NULL,
	`course_id` varchar(255) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now())
);
--> statement-breakpoint
ALTER TABLE `saved_courses` ADD CONSTRAINT `saved_courses_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saved_courses` ADD CONSTRAINT `saved_courses_course_id_courses_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;