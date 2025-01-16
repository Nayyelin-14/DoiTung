CREATE TABLE `users` (
	`user_id` varchar(225) NOT NULL,
	`user_name` varchar(225) NOT NULL,
	`user_email` varchar(225) NOT NULL,
	`user_password` text NOT NULL,
	`user_token` varchar(250),
	`emailVerified` timestamp DEFAULT null,
	`user_profileImage` text,
	`created_at` timestamp NOT NULL,
	`enrolled_course_id` int,
	`wishlist_id` int,
	`comment_id` int,
	`review_id` int,
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
	`Two_factorID` varchar(225) NOT NULL,
	`TwoFactor_code` varchar(500) NOT NULL,
	`expires` timestamp NOT NULL,
	`user_email` varchar(225) NOT NULL,
	`user_id` varchar(225),
	CONSTRAINT `twofactor_Two_factorID_TwoFactor_code_pk` PRIMARY KEY(`Two_factorID`,`TwoFactor_code`),
	CONSTRAINT `twofactor_user_email_unique` UNIQUE(`user_email`)
);
--> statement-breakpoint
ALTER TABLE `emailverification` ADD CONSTRAINT `emailverification_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `twofactor` ADD CONSTRAINT `twofactor_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;