ALTER TABLE `twofactor` RENAME COLUMN `TwoFactor_code` TO `Two_stepID`;--> statement-breakpoint
ALTER TABLE `twofactor` RENAME COLUMN `Two_factorID` TO `Twostep_code`;--> statement-breakpoint
ALTER TABLE `twofactor` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `twofactor` MODIFY COLUMN `Twostep_code` varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE `twofactor` MODIFY COLUMN `Two_stepID` varchar(225) NOT NULL;--> statement-breakpoint
ALTER TABLE `twofactor` ADD PRIMARY KEY(`Two_stepID`,`Twostep_code`);--> statement-breakpoint
ALTER TABLE `users` ADD `isTwostepEnabled` boolean DEFAULT false;