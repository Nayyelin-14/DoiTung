CREATE TABLE `certificates` (
	`certificate_id` varchar(225) NOT NULL,
	`userID` varchar(225) NOT NULL,
	`courseID` varchar(225) NOT NULL,
	`testID` varchar(225) NOT NULL,
	`score` float NOT NULL,
	`certificate_url` varchar(255) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `certificates_certificate_id` PRIMARY KEY(`certificate_id`)
);
--> statement-breakpoint
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_userID_users_user_id_fk` FOREIGN KEY (`userID`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_courseID_courses_course_id_fk` FOREIGN KEY (`courseID`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_testID_tests_test_id_fk` FOREIGN KEY (`testID`) REFERENCES `tests`(`test_id`) ON DELETE cascade ON UPDATE no action;