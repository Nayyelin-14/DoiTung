CREATE TABLE `comments` (
	`comment_id` varchar(225) NOT NULL,
	`lesson_id` varchar(225) NOT NULL,
	`user_id` varchar(225) NOT NULL,
	`comment_text` text NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `comments_comment_id` PRIMARY KEY(`comment_id`)
);
--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_lesson_id_lessons_lesson_id_fk` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`lesson_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;