ALTER TABLE `twofactor` RENAME COLUMN `Two_stepID` TO `Twostep_ID`;--> statement-breakpoint
ALTER TABLE `twofactor` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `twofactor` ADD PRIMARY KEY(`Twostep_ID`,`Twostep_code`);