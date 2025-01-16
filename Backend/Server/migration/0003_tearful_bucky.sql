ALTER TABLE `users` ADD `role` text DEFAULT ('user');--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `wishlist_id`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `comment_id`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `review_id`;