PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users_chirho` (
	`id_chirho` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email_chirho` text NOT NULL,
	`password_hash_chirho` text,
	`name_chirho` text,
	`avatar_url_chirho` text,
	`role_chirho` text DEFAULT 'public' NOT NULL,
	`orphanage_id_chirho` integer,
	`google_id_chirho` text,
	`github_id_chirho` text,
	`apple_id_chirho` text,
	`auth_provider_chirho` text DEFAULT 'email' NOT NULL,
	`email_verified_chirho` integer DEFAULT false NOT NULL,
	`is_active_chirho` integer DEFAULT true NOT NULL,
	`created_at_chirho` text DEFAULT '' NOT NULL,
	`updated_at_chirho` text
);
--> statement-breakpoint
INSERT INTO `__new_users_chirho`("id_chirho", "email_chirho", "password_hash_chirho", "name_chirho", "avatar_url_chirho", "role_chirho", "orphanage_id_chirho", "google_id_chirho", "github_id_chirho", "apple_id_chirho", "auth_provider_chirho", "email_verified_chirho", "is_active_chirho", "created_at_chirho", "updated_at_chirho") SELECT "id_chirho", "email_chirho", "password_hash_chirho", "name_chirho", "avatar_url_chirho", "role_chirho", "orphanage_id_chirho", "google_id_chirho", "github_id_chirho", "apple_id_chirho", "auth_provider_chirho", "email_verified_chirho", "is_active_chirho", "created_at_chirho", "updated_at_chirho" FROM `users_chirho`;--> statement-breakpoint
DROP TABLE `users_chirho`;--> statement-breakpoint
ALTER TABLE `__new_users_chirho` RENAME TO `users_chirho`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_chirho_email_chirho_unique` ON `users_chirho` (`email_chirho`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_chirho_google_id_chirho_unique` ON `users_chirho` (`google_id_chirho`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_chirho_github_id_chirho_unique` ON `users_chirho` (`github_id_chirho`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_chirho_apple_id_chirho_unique` ON `users_chirho` (`apple_id_chirho`);