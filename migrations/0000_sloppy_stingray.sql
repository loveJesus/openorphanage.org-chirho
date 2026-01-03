CREATE TABLE `audit_log_chirho` (
	`id_chirho` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id_chirho` integer,
	`action_chirho` text NOT NULL,
	`entity_type_chirho` text NOT NULL,
	`entity_id_chirho` integer,
	`details_chirho` text,
	`ip_address_chirho` text,
	`user_agent_chirho` text,
	`created_at_chirho` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `children_chirho` (
	`id_chirho` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`orphanage_id_chirho` integer NOT NULL,
	`pseudonym_chirho` text NOT NULL,
	`birth_year_chirho` integer,
	`gender_chirho` text,
	`status_chirho` text DEFAULT 'in_care' NOT NULL,
	`story_kv_key_chirho` text,
	`needs_kv_key_chirho` text,
	`photo_r2_key_chirho` text,
	`photo_consent_chirho` integer DEFAULT false NOT NULL,
	`sponsor_id_chirho` integer,
	`sponsored_at_chirho` text,
	`education_level_chirho` text,
	`career_interests_chirho` text,
	`is_active_chirho` integer DEFAULT true NOT NULL,
	`entry_date_chirho` text,
	`created_at_chirho` text DEFAULT '' NOT NULL,
	`updated_at_chirho` text
);
--> statement-breakpoint
CREATE TABLE `donations_chirho` (
	`id_chirho` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id_chirho` text,
	`orphanage_id_chirho` integer,
	`need_id_chirho` integer,
	`donor_id_chirho` integer,
	`amount_chirho` real NOT NULL,
	`currency_chirho` text DEFAULT 'USD' NOT NULL,
	`status_chirho` text DEFAULT 'pending' NOT NULL,
	`message_chirho` text,
	`anonymous_chirho` integer DEFAULT false NOT NULL,
	`created_at_chirho` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `donations_chirho_external_id_chirho_unique` ON `donations_chirho` (`external_id_chirho`);--> statement-breakpoint
CREATE TABLE `feature_requests_chirho` (
	`id_chirho` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title_chirho` text NOT NULL,
	`description_chirho` text NOT NULL,
	`category_chirho` text DEFAULT 'platform' NOT NULL,
	`status_chirho` text DEFAULT 'proposed' NOT NULL,
	`vote_count_chirho` integer DEFAULT 0 NOT NULL,
	`submitted_by_chirho` integer,
	`admin_response_chirho` text,
	`created_at_chirho` text DEFAULT '' NOT NULL,
	`updated_at_chirho` text
);
--> statement-breakpoint
CREATE TABLE `feature_votes_chirho` (
	`id_chirho` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`feature_id_chirho` integer NOT NULL,
	`user_id_chirho` integer NOT NULL,
	`vote_type_chirho` text DEFAULT 'upvote' NOT NULL,
	`created_at_chirho` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `feedback_chirho` (
	`id_chirho` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id_chirho` integer,
	`email_chirho` text,
	`type_chirho` text NOT NULL,
	`rating_chirho` integer,
	`content_preview_chirho` text,
	`content_kv_key_chirho` text,
	`is_anonymous_chirho` integer DEFAULT false NOT NULL,
	`public_visible_chirho` integer DEFAULT false NOT NULL,
	`status_chirho` text DEFAULT 'pending' NOT NULL,
	`admin_notes_chirho` text,
	`created_at_chirho` text DEFAULT '' NOT NULL,
	`resolved_at_chirho` text
);
--> statement-breakpoint
CREATE TABLE `needs_chirho` (
	`id_chirho` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`orphanage_id_chirho` integer NOT NULL,
	`child_id_chirho` integer,
	`category_chirho` text NOT NULL,
	`title_chirho` text NOT NULL,
	`short_description_chirho` text,
	`description_kv_key_chirho` text,
	`priority_chirho` text DEFAULT 'medium' NOT NULL,
	`amount_needed_chirho` real DEFAULT 0,
	`amount_raised_chirho` real DEFAULT 0,
	`currency_chirho` text DEFAULT 'USD' NOT NULL,
	`status_chirho` text DEFAULT 'active' NOT NULL,
	`campaign_id_chirho` text,
	`fulfilled_at_chirho` text,
	`created_by_chirho` integer,
	`created_at_chirho` text DEFAULT '' NOT NULL,
	`updated_at_chirho` text
);
--> statement-breakpoint
CREATE TABLE `orphanages_chirho` (
	`id_chirho` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name_chirho` text NOT NULL,
	`country_chirho` text NOT NULL,
	`region_chirho` text,
	`short_description_chirho` text,
	`description_kv_key_chirho` text,
	`children_count_chirho` integer DEFAULT 0,
	`capacity_chirho` integer,
	`primary_photo_url_chirho` text,
	`logo_r2_key_chirho` text,
	`cover_r2_key_chirho` text,
	`verification_status_chirho` text DEFAULT 'pending' NOT NULL,
	`verified_at_chirho` text,
	`trust_score_chirho` real DEFAULT 0,
	`contact_email_chirho` text,
	`contact_phone_chirho` text,
	`website_chirho` text,
	`is_active_chirho` integer DEFAULT true NOT NULL,
	`created_by_chirho` integer,
	`created_at_chirho` text DEFAULT '' NOT NULL,
	`updated_at_chirho` text
);
--> statement-breakpoint
CREATE TABLE `support_tickets_chirho` (
	`id_chirho` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id_chirho` integer,
	`email_chirho` text NOT NULL,
	`name_chirho` text,
	`subject_chirho` text NOT NULL,
	`category_chirho` text DEFAULT 'general' NOT NULL,
	`priority_chirho` text DEFAULT 'normal' NOT NULL,
	`status_chirho` text DEFAULT 'open' NOT NULL,
	`content_preview_chirho` text,
	`content_kv_key_chirho` text,
	`assigned_to_chirho` integer,
	`resolved_by_chirho` integer,
	`resolution_notes_chirho` text,
	`created_at_chirho` text DEFAULT '' NOT NULL,
	`updated_at_chirho` text,
	`resolved_at_chirho` text
);
--> statement-breakpoint
CREATE TABLE `users_chirho` (
	`id_chirho` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email_chirho` text NOT NULL,
	`password_hash_chirho` text NOT NULL,
	`name_chirho` text,
	`role_chirho` text DEFAULT 'public' NOT NULL,
	`orphanage_id_chirho` integer,
	`email_verified_chirho` integer DEFAULT false NOT NULL,
	`is_active_chirho` integer DEFAULT true NOT NULL,
	`created_at_chirho` text DEFAULT '' NOT NULL,
	`updated_at_chirho` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_chirho_email_chirho_unique` ON `users_chirho` (`email_chirho`);