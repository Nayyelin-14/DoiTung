CREATE TABLE `user_reports` (
	`report_id` varchar(225) NOT NULL,
	`subject` text NOT NULL,
	`contents` text NOT NULL,
	`user_id` varchar(225) NOT NULL,
	`admin_id` varchar(225),
	`is_read` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `user_reports_report_id` PRIMARY KEY(`report_id`)
);
