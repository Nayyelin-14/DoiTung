CREATE TABLE `draft` (
	`draft_id` varchar(225) NOT NULL,
	`userID` varchar(225) NOT NULL,
	`courseID` varchar(225) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `draft_draft_id` PRIMARY KEY(`draft_id`)
);
--> statement-breakpoint
ALTER TABLE `draft` ADD CONSTRAINT `draft_userID_users_user_id_fk` FOREIGN KEY (`userID`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `draft` ADD CONSTRAINT `draft_courseID_courses_course_id_fk` FOREIGN KEY (`courseID`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;