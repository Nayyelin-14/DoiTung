ALTER TABLE `users` ADD `failed_attempts` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `last_failed_attempt` timestamp NOT NULL;