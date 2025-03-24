CREATE TABLE `test_status` (
	`status_id` varchar(225) NOT NULL,
	`userID` varchar(225) NOT NULL,
	`testID` varchar(225) NOT NULL,
	`courseID` varchar(225) NOT NULL,
	`startTime` timestamp DEFAULT (now()),
	`expiresAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `test_status_status_id` PRIMARY KEY(`status_id`)
);
--> statement-breakpoint
ALTER TABLE `test_status` ADD CONSTRAINT `test_status_userID_users_user_id_fk` FOREIGN KEY (`userID`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_status` ADD CONSTRAINT `test_status_testID_tests_test_id_fk` FOREIGN KEY (`testID`) REFERENCES `tests`(`test_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_status` ADD CONSTRAINT `test_status_courseID_courses_course_id_fk` FOREIGN KEY (`courseID`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;