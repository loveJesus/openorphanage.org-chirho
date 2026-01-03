CREATE TABLE `newsletter_subscribers_chirho` (
	`id_chirho` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email_chirho` text NOT NULL,
	`name_chirho` text,
	`status_chirho` text DEFAULT 'pending' NOT NULL,
	`confirm_token_chirho` text,
	`confirm_token_expires_chirho` text,
	`unsubscribe_token_chirho` text,
	`confirmed_at_chirho` text,
	`unsubscribed_at_chirho` text,
	`subscribed_from_chirho` text,
	`created_at_chirho` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_subscribers_chirho_email_chirho_unique` ON `newsletter_subscribers_chirho` (`email_chirho`);