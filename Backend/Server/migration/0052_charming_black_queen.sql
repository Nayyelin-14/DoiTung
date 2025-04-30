ALTER TABLE `user_courses` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `user_attempts` ADD `courseID` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_attempts` ADD CONSTRAINT `user_attempts_courseID_courses_course_id_fk` FOREIGN KEY (`courseID`) REFERENCES `courses`(`course_id`) ON DELETE cascade ON UPDATE no action;