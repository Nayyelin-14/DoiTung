CREATE TABLE `course_reviews` (
	`review_id` varchar(225) NOT NULL,
	`course_id` varchar(225) NOT NULL,
	`user_id` varchar(225) NOT NULL,
	`rating` float NOT NULL,
	`review_text` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `course_reviews_review_id` PRIMARY KEY(`review_id`)
);
--> statement-breakpoint
ALTER TABLE `course_reviews` ADD CONSTRAINT `course_reviews_course_id_courses_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_reviews` ADD CONSTRAINT `course_reviews_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;