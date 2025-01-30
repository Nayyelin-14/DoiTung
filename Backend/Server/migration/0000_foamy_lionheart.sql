CREATE TABLE `users` (
	`user_id` varchar(225) NOT NULL,
	`user_name` varchar(225) NOT NULL,
	`user_email` varchar(225) NOT NULL,
	`user_password` varchar(365),
	`user_token` varchar(250),
	`emailVerified` timestamp DEFAULT null,
	`isTwostepEnabled` boolean DEFAULT false,
	`role` text DEFAULT ('user'),
	`user_profileImage` text,
	`created_at` timestamp NOT NULL,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `emailverification` (
	`verification_id` varchar(225) NOT NULL,
	`verification_token` varchar(500) NOT NULL,
	`expires` timestamp NOT NULL,
	`user_email` varchar(225) NOT NULL,
	`user_id` varchar(225),
	CONSTRAINT `emailverification_verification_id_verification_token_pk` PRIMARY KEY(`verification_id`,`verification_token`)
);
--> statement-breakpoint
CREATE TABLE `twofactor` (
	`Twostep_ID` varchar(225) NOT NULL,
	`Twostep_code` varchar(500) NOT NULL,
	`expires` timestamp NOT NULL,
	`user_email` varchar(225) NOT NULL,
	`user_id` varchar(225),
	CONSTRAINT `twofactor_Twostep_ID_Twostep_code_pk` PRIMARY KEY(`Twostep_ID`,`Twostep_code`),
	CONSTRAINT `twofactor_user_email_unique` UNIQUE(`user_email`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`course_id` varchar(225) NOT NULL,
	`course_name` varchar(225) NOT NULL,
	`course_description` text,
	`course_image_url` varchar(500) NOT NULL,
	`demo_URL` varchar(500) NOT NULL,
	`category` varchar(225) NOT NULL,
	`overview` varchar(225) NOT NULL,
	`instructor_name` varchar(225) NOT NULL,
	`status` varchar(225) NOT NULL DEFAULT 'draft',
	`rating` float NOT NULL DEFAULT 0,
	`is_popular` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `courses_course_id` PRIMARY KEY(`course_id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`lesson_id` varchar(225) NOT NULL,
	`lesson_title` varchar(225) NOT NULL,
	`video_url` varchar(500) NOT NULL,
	`duration` float NOT NULL DEFAULT 0,
	`isCompleted` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`moduleID` varchar(225) NOT NULL,
	CONSTRAINT `lessons_lesson_id` PRIMARY KEY(`lesson_id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`module_id` varchar(225) NOT NULL,
	`module_title` varchar(225) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`isCompleted` boolean DEFAULT false,
	`courseID` varchar(225) NOT NULL,
	CONSTRAINT `modules_module_id` PRIMARY KEY(`module_id`)
);
--> statement-breakpoint
CREATE TABLE `user_courses` (
	`user_id` varchar(225) NOT NULL,
	`course_id` varchar(225) NOT NULL,
	`is_completed` boolean DEFAULT false,
	`progress` float DEFAULT 0,
	`enrolled_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `account` (
	`userId` varchar(255) NOT NULL,
	`user_email` varchar(225) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` varchar(2048),
	`session_state` varchar(255),
	CONSTRAINT `account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `draft` (
	`draft_id` varchar(225) NOT NULL,
	`userID` varchar(225) NOT NULL,
	`courseID` varchar(225) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `draft_draft_id` PRIMARY KEY(`draft_id`)
);
--> statement-breakpoint
ALTER TABLE `emailverification` ADD CONSTRAINT `emailverification_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `twofactor` ADD CONSTRAINT `twofactor_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_moduleID_modules_module_id_fk` FOREIGN KEY (`moduleID`) REFERENCES `modules`(`module_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `modules` ADD CONSTRAINT `modules_courseID_courses_course_id_fk` FOREIGN KEY (`courseID`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_courses` ADD CONSTRAINT `user_courses_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_courses` ADD CONSTRAINT `user_courses_course_id_courses_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_userId_users_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `draft` ADD CONSTRAINT `draft_userID_users_user_id_fk` FOREIGN KEY (`userID`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `draft` ADD CONSTRAINT `draft_courseID_courses_course_id_fk` FOREIGN KEY (`courseID`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;