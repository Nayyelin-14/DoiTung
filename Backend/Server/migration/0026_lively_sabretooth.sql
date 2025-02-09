CREATE TABLE `quizzes` (
	`quiz_id` varchar(225) NOT NULL,
	`title` varchar(225) NOT NULL,
	`moduleID` varchar(225) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `quizzes_quiz_id` PRIMARY KEY(`quiz_id`)
);
--> statement-breakpoint
CREATE TABLE `tests` (
	`test_id` varchar(225) NOT NULL,
	`title` varchar(225) NOT NULL,
	`courseID` varchar(225) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `tests_test_id` PRIMARY KEY(`test_id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`question_id` varchar(225) NOT NULL,
	`question_text` text NOT NULL,
	`options` text NOT NULL,
	`correct_option` varchar(255) NOT NULL,
	`quizID` varchar(225),
	`testID` varchar(225),
	CONSTRAINT `questions_question_id` PRIMARY KEY(`question_id`)
);
--> statement-breakpoint
CREATE TABLE `user_attempts` (
	`attempt_id` varchar(225) NOT NULL,
	`userID` varchar(225) NOT NULL,
	`quizID` varchar(225),
	`testID` varchar(225),
	`score` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `user_attempts_attempt_id` PRIMARY KEY(`attempt_id`)
);
--> statement-breakpoint
ALTER TABLE `quizzes` ADD CONSTRAINT `quizzes_moduleID_modules_module_id_fk` FOREIGN KEY (`moduleID`) REFERENCES `modules`(`module_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tests` ADD CONSTRAINT `tests_courseID_courses_course_id_fk` FOREIGN KEY (`courseID`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_quizID_quizzes_quiz_id_fk` FOREIGN KEY (`quizID`) REFERENCES `quizzes`(`quiz_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_testID_tests_test_id_fk` FOREIGN KEY (`testID`) REFERENCES `tests`(`test_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_attempts` ADD CONSTRAINT `user_attempts_userID_users_user_id_fk` FOREIGN KEY (`userID`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_attempts` ADD CONSTRAINT `user_attempts_quizID_quizzes_quiz_id_fk` FOREIGN KEY (`quizID`) REFERENCES `quizzes`(`quiz_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_attempts` ADD CONSTRAINT `user_attempts_testID_tests_test_id_fk` FOREIGN KEY (`testID`) REFERENCES `tests`(`test_id`) ON DELETE cascade ON UPDATE no action;