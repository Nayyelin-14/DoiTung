CREATE TABLE `courses` (
	`course_id` varchar(225) NOT NULL,
	`course_name` varchar(225) NOT NULL,
	`course_description` text,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp DEFAULT null,
	CONSTRAINT `courses_course_id` PRIMARY KEY(`course_id`)
);
