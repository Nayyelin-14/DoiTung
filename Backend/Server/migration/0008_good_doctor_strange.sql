CREATE TABLE `user_courses` (
	`user_id` varchar(225) NOT NULL,
	`course_id` varchar(225) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `user_courses` ADD CONSTRAINT `user_courses_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_courses` ADD CONSTRAINT `user_courses_course_id_courses_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;