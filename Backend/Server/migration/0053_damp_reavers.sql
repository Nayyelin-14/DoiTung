ALTER TABLE `user_attempts` DROP FOREIGN KEY `user_attempts_courseID_courses_course_id_fk`;
--> statement-breakpoint
ALTER TABLE `user_attempts` ADD CONSTRAINT `user_attempts_courseID_courses_course_id_fk` FOREIGN KEY (`courseID`) REFERENCES `courses`(`course_id`) ON DELETE no action ON UPDATE no action;