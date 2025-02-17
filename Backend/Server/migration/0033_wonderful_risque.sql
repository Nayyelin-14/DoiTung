CREATE TABLE `completed_lessons` (
	`lesson_id` varchar(225) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`course_id` varchar(255) NOT NULL,
	`completed_lessons` varchar(5000) DEFAULT '[]',
	CONSTRAINT `completed_lessons_lesson_id` PRIMARY KEY(`lesson_id`)
);
--> statement-breakpoint
ALTER TABLE `completed_lessons` ADD CONSTRAINT `completed_lessons_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `completed_lessons` ADD CONSTRAINT `completed_lessons_course_id_courses_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;