CREATE TABLE `lessons` (
	`lesson_id` varchar(225) NOT NULL,
	`lesson_title` varchar(225) NOT NULL,
	`video_url` varchar(500) NOT NULL,
	`video_progress` float NOT NULL DEFAULT 0,
	`video_duration` int NOT NULL,
	`isCompleted` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`moduleID` varchar(225) NOT NULL,
	CONSTRAINT `lessons_lesson_id` PRIMARY KEY(`lesson_id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`module_id` varchar(225) NOT NULL,
	`course_name` varchar(225) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`isCompleted` boolean DEFAULT false,
	`courseID` text NOT NULL,
	CONSTRAINT `modules_module_id` PRIMARY KEY(`module_id`)
);
--> statement-breakpoint
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_moduleID_modules_module_id_fk` FOREIGN KEY (`moduleID`) REFERENCES `modules`(`module_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `modules` ADD CONSTRAINT `modules_courseID_courses_course_id_fk` FOREIGN KEY (`courseID`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;