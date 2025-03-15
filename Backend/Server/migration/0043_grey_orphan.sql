DROP TABLE `emailverification`;--> statement-breakpoint
DROP TABLE `twofactor`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `user_password` varchar(225) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` text NOT NULL DEFAULT ('user');--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `user_email`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `emailVerified`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `isTwostepEnabled`;