// For God so loved the world that He gave His only begotten Son...
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// =============================================================================
// USERS - Platform users (donors, staff, admins)
// =============================================================================
export const usersChirho = sqliteTable('users_chirho', {
	idChirho: integer('id_chirho').primaryKey({ autoIncrement: true }),
	emailChirho: text('email_chirho').notNull().unique(),
	passwordHashChirho: text('password_hash_chirho'), // Nullable for OAuth users
	nameChirho: text('name_chirho'),
	avatarUrlChirho: text('avatar_url_chirho'), // Profile picture from OAuth
	roleChirho: text('role_chirho', {
		enum: ['public', 'donor', 'staff', 'admin', 'super_admin']
	}).notNull().default('public'),
	orphanageIdChirho: integer('orphanage_id_chirho'),
	// OAuth provider IDs (nullable, for future providers)
	googleIdChirho: text('google_id_chirho').unique(),
	githubIdChirho: text('github_id_chirho').unique(),
	appleIdChirho: text('apple_id_chirho').unique(),
	// Track primary auth method
	authProviderChirho: text('auth_provider_chirho', {
		enum: ['email', 'google', 'github', 'apple']
	}).notNull().default('email'),
	emailVerifiedChirho: integer('email_verified_chirho', { mode: 'boolean' }).notNull().default(false),
	isActiveChirho: integer('is_active_chirho', { mode: 'boolean' }).notNull().default(true),
	createdAtChirho: text('created_at_chirho').notNull().default(''),
	updatedAtChirho: text('updated_at_chirho')
});

// =============================================================================
// ORPHANAGES - Registered orphanage facilities
// =============================================================================
export const orphanagesChirho = sqliteTable('orphanages_chirho', {
	idChirho: integer('id_chirho').primaryKey({ autoIncrement: true }),
	nameChirho: text('name_chirho').notNull(),
	countryChirho: text('country_chirho').notNull(),
	regionChirho: text('region_chirho'),
	shortDescriptionChirho: text('short_description_chirho'),
	descriptionKvKeyChirho: text('description_kv_key_chirho'), // Large text in KV
	childrenCountChirho: integer('children_count_chirho').default(0),
	capacityChirho: integer('capacity_chirho'),
	// Media
	primaryPhotoUrlChirho: text('primary_photo_url_chirho'),
	logoR2KeyChirho: text('logo_r2_key_chirho'),
	coverR2KeyChirho: text('cover_r2_key_chirho'),
	// Verification
	verificationStatusChirho: text('verification_status_chirho', {
		enum: ['pending', 'verified', 'rejected']
	}).notNull().default('pending'),
	verifiedAtChirho: text('verified_at_chirho'),
	trustScoreChirho: real('trust_score_chirho').default(0),
	// Contact (not public)
	contactEmailChirho: text('contact_email_chirho'),
	contactPhoneChirho: text('contact_phone_chirho'),
	websiteChirho: text('website_chirho'),
	// Tracking
	isActiveChirho: integer('is_active_chirho', { mode: 'boolean' }).notNull().default(true),
	createdByChirho: integer('created_by_chirho'),
	createdAtChirho: text('created_at_chirho').notNull().default(''),
	updatedAtChirho: text('updated_at_chirho')
});

// =============================================================================
// CHILDREN - Anonymized child records (PRIVACY CRITICAL)
// =============================================================================
export const childrenChirho = sqliteTable('children_chirho', {
	idChirho: integer('id_chirho').primaryKey({ autoIncrement: true }),
	orphanageIdChirho: integer('orphanage_id_chirho').notNull(),
	// Privacy: Use pseudonym only, never real name
	pseudonymChirho: text('pseudonym_chirho').notNull(),
	// Privacy: Only birth year, not exact date
	birthYearChirho: integer('birth_year_chirho'),
	genderChirho: text('gender_chirho', { enum: ['male', 'female'] }),
	// Status tracking
	statusChirho: text('status_chirho', {
		enum: ['in_care', 'sponsored', 'transitioning', 'graduated', 'adopted', 'reunified']
	}).notNull().default('in_care'),
	// Large text in KV (story, needs, progress)
	storyKvKeyChirho: text('story_kv_key_chirho'),
	needsKvKeyChirho: text('needs_kv_key_chirho'),
	// Photo in R2 (with consent)
	photoR2KeyChirho: text('photo_r2_key_chirho'),
	photoConsentChirho: integer('photo_consent_chirho', { mode: 'boolean' }).notNull().default(false),
	// Sponsorship link
	sponsorIdChirho: integer('sponsor_id_chirho'),
	sponsoredAtChirho: text('sponsored_at_chirho'),
	// Education tracking
	educationLevelChirho: text('education_level_chirho'),
	careerInterestsChirho: text('career_interests_chirho'),
	// Tracking
	isActiveChirho: integer('is_active_chirho', { mode: 'boolean' }).notNull().default(true),
	entryDateChirho: text('entry_date_chirho'),
	createdAtChirho: text('created_at_chirho').notNull().default(''),
	updatedAtChirho: text('updated_at_chirho')
});

// =============================================================================
// NEEDS - Tracked needs for orphanages and children
// =============================================================================
export const needsChirho = sqliteTable('needs_chirho', {
	idChirho: integer('id_chirho').primaryKey({ autoIncrement: true }),
	orphanageIdChirho: integer('orphanage_id_chirho').notNull(),
	childIdChirho: integer('child_id_chirho'),
	categoryChirho: text('category_chirho', {
		enum: ['food', 'medical', 'education', 'clothing', 'infrastructure', 'staff', 'utilities', 'transportation', 'other']
	}).notNull(),
	titleChirho: text('title_chirho').notNull(),
	shortDescriptionChirho: text('short_description_chirho'),
	descriptionKvKeyChirho: text('description_kv_key_chirho'),
	priorityChirho: text('priority_chirho', {
		enum: ['low', 'medium', 'high', 'urgent']
	}).notNull().default('medium'),
	amountNeededChirho: real('amount_needed_chirho').default(0),
	amountRaisedChirho: real('amount_raised_chirho').default(0),
	currencyChirho: text('currency_chirho').notNull().default('USD'),
	statusChirho: text('status_chirho', {
		enum: ['active', 'funded', 'completed', 'cancelled']
	}).notNull().default('active'),
	// External campaign link
	campaignIdChirho: text('campaign_id_chirho'),
	fulfilledAtChirho: text('fulfilled_at_chirho'),
	// Tracking
	createdByChirho: integer('created_by_chirho'),
	createdAtChirho: text('created_at_chirho').notNull().default(''),
	updatedAtChirho: text('updated_at_chirho')
});

// =============================================================================
// DONATIONS - Track donations from KingdomInvest.ing webhooks
// =============================================================================
export const donationsChirho = sqliteTable('donations_chirho', {
	idChirho: integer('id_chirho').primaryKey({ autoIncrement: true }),
	externalIdChirho: text('external_id_chirho').unique(), // From KingdomInvest.ing
	orphanageIdChirho: integer('orphanage_id_chirho'),
	needIdChirho: integer('need_id_chirho'),
	donorIdChirho: integer('donor_id_chirho'),
	amountChirho: real('amount_chirho').notNull(),
	currencyChirho: text('currency_chirho').notNull().default('USD'),
	statusChirho: text('status_chirho', {
		enum: ['pending', 'completed', 'refunded', 'failed']
	}).notNull().default('pending'),
	messageChirho: text('message_chirho'),
	anonymousChirho: integer('anonymous_chirho', { mode: 'boolean' }).notNull().default(false),
	createdAtChirho: text('created_at_chirho').notNull().default('')
});

// =============================================================================
// FEEDBACK - User feedback system (from guide)
// =============================================================================
export const feedbackChirho = sqliteTable('feedback_chirho', {
	idChirho: integer('id_chirho').primaryKey({ autoIncrement: true }),
	userIdChirho: integer('user_id_chirho'),
	emailChirho: text('email_chirho'),
	typeChirho: text('type_chirho', {
		enum: ['bug', 'feature_request', 'safety_concern', 'general']
	}).notNull(),
	ratingChirho: integer('rating_chirho'),
	contentPreviewChirho: text('content_preview_chirho'),
	contentKvKeyChirho: text('content_kv_key_chirho'),
	isAnonymousChirho: integer('is_anonymous_chirho', { mode: 'boolean' }).notNull().default(false),
	publicVisibleChirho: integer('public_visible_chirho', { mode: 'boolean' }).notNull().default(false),
	statusChirho: text('status_chirho', {
		enum: ['pending', 'reviewed', 'resolved', 'dismissed']
	}).notNull().default('pending'),
	adminNotesChirho: text('admin_notes_chirho'),
	createdAtChirho: text('created_at_chirho').notNull().default(''),
	resolvedAtChirho: text('resolved_at_chirho')
});

// =============================================================================
// AUDIT LOG - Track all sensitive actions
// =============================================================================
export const auditLogChirho = sqliteTable('audit_log_chirho', {
	idChirho: integer('id_chirho').primaryKey({ autoIncrement: true }),
	userIdChirho: integer('user_id_chirho'),
	actionChirho: text('action_chirho').notNull(),
	entityTypeChirho: text('entity_type_chirho').notNull(),
	entityIdChirho: integer('entity_id_chirho'),
	detailsChirho: text('details_chirho'),
	ipAddressChirho: text('ip_address_chirho'),
	userAgentChirho: text('user_agent_chirho'),
	createdAtChirho: text('created_at_chirho').notNull().default('')
});

// =============================================================================
// SUPPORT TICKETS - User support requests
// =============================================================================
export const supportTicketsChirho = sqliteTable('support_tickets_chirho', {
	idChirho: integer('id_chirho').primaryKey({ autoIncrement: true }),
	userIdChirho: integer('user_id_chirho'),
	emailChirho: text('email_chirho').notNull(),
	nameChirho: text('name_chirho'),
	subjectChirho: text('subject_chirho').notNull(),
	categoryChirho: text('category_chirho', {
		enum: ['general', 'donation', 'technical', 'orphanage', 'safety', 'gdpr', 'other']
	}).notNull().default('general'),
	priorityChirho: text('priority_chirho', {
		enum: ['low', 'normal', 'high', 'urgent']
	}).notNull().default('normal'),
	statusChirho: text('status_chirho', {
		enum: ['open', 'in_progress', 'waiting_response', 'resolved', 'closed']
	}).notNull().default('open'),
	contentPreviewChirho: text('content_preview_chirho'),
	contentKvKeyChirho: text('content_kv_key_chirho'),
	assignedToChirho: integer('assigned_to_chirho'),
	resolvedByChirho: integer('resolved_by_chirho'),
	resolutionNotesChirho: text('resolution_notes_chirho'),
	createdAtChirho: text('created_at_chirho').notNull().default(''),
	updatedAtChirho: text('updated_at_chirho'),
	resolvedAtChirho: text('resolved_at_chirho')
});

// =============================================================================
// FEATURE VOTES - Community feature voting
// =============================================================================
export const featureRequestsChirho = sqliteTable('feature_requests_chirho', {
	idChirho: integer('id_chirho').primaryKey({ autoIncrement: true }),
	titleChirho: text('title_chirho').notNull(),
	descriptionChirho: text('description_chirho').notNull(),
	categoryChirho: text('category_chirho', {
		enum: ['platform', 'donors', 'orphanages', 'children', 'mobile', 'accessibility', 'other']
	}).notNull().default('platform'),
	statusChirho: text('status_chirho', {
		enum: ['proposed', 'under_review', 'planned', 'in_progress', 'completed', 'declined']
	}).notNull().default('proposed'),
	voteCountChirho: integer('vote_count_chirho').notNull().default(0),
	submittedByChirho: integer('submitted_by_chirho'),
	adminResponseChirho: text('admin_response_chirho'),
	createdAtChirho: text('created_at_chirho').notNull().default(''),
	updatedAtChirho: text('updated_at_chirho')
});

export const featureVotesChirho = sqliteTable('feature_votes_chirho', {
	idChirho: integer('id_chirho').primaryKey({ autoIncrement: true }),
	featureIdChirho: integer('feature_id_chirho').notNull(),
	userIdChirho: integer('user_id_chirho').notNull(),
	voteTypeChirho: text('vote_type_chirho', {
		enum: ['upvote', 'downvote']
	}).notNull().default('upvote'),
	createdAtChirho: text('created_at_chirho').notNull().default('')
});

// =============================================================================
// NEWSLETTER SUBSCRIBERS - Double opt-in newsletter system
// =============================================================================
export const newsletterSubscribersChirho = sqliteTable('newsletter_subscribers_chirho', {
	idChirho: integer('id_chirho').primaryKey({ autoIncrement: true }),
	emailChirho: text('email_chirho').notNull().unique(),
	nameChirho: text('name_chirho'),
	// Double opt-in status
	statusChirho: text('status_chirho', {
		enum: ['pending', 'confirmed', 'unsubscribed']
	}).notNull().default('pending'),
	// Confirmation token for double opt-in
	confirmTokenChirho: text('confirm_token_chirho'),
	confirmTokenExpiresChirho: text('confirm_token_expires_chirho'),
	// Unsubscribe token (never expires)
	unsubscribeTokenChirho: text('unsubscribe_token_chirho'),
	// Tracking
	confirmedAtChirho: text('confirmed_at_chirho'),
	unsubscribedAtChirho: text('unsubscribed_at_chirho'),
	subscribedFromChirho: text('subscribed_from_chirho'), // e.g., 'footer', 'homepage', 'orphanage_page'
	createdAtChirho: text('created_at_chirho').notNull().default('')
});

// =============================================================================
// RELATIONS
// =============================================================================
export const usersRelationsChirho = relations(usersChirho, ({ one, many }) => ({
	orphanageChirho: one(orphanagesChirho, {
		fields: [usersChirho.orphanageIdChirho],
		references: [orphanagesChirho.idChirho]
	}),
	sponsoredChildrenChirho: many(childrenChirho),
	donationsChirho: many(donationsChirho),
	feedbackChirho: many(feedbackChirho)
}));

export const orphanagesRelationsChirho = relations(orphanagesChirho, ({ many }) => ({
	staffChirho: many(usersChirho),
	childrenChirho: many(childrenChirho),
	needsChirho: many(needsChirho),
	donationsChirho: many(donationsChirho)
}));

export const childrenRelationsChirho = relations(childrenChirho, ({ one, many }) => ({
	orphanageChirho: one(orphanagesChirho, {
		fields: [childrenChirho.orphanageIdChirho],
		references: [orphanagesChirho.idChirho]
	}),
	sponsorChirho: one(usersChirho, {
		fields: [childrenChirho.sponsorIdChirho],
		references: [usersChirho.idChirho]
	}),
	needsChirho: many(needsChirho)
}));

export const needsRelationsChirho = relations(needsChirho, ({ one, many }) => ({
	orphanageChirho: one(orphanagesChirho, {
		fields: [needsChirho.orphanageIdChirho],
		references: [orphanagesChirho.idChirho]
	}),
	childChirho: one(childrenChirho, {
		fields: [needsChirho.childIdChirho],
		references: [childrenChirho.idChirho]
	}),
	donationsChirho: many(donationsChirho)
}));

export const donationsRelationsChirho = relations(donationsChirho, ({ one }) => ({
	orphanageChirho: one(orphanagesChirho, {
		fields: [donationsChirho.orphanageIdChirho],
		references: [orphanagesChirho.idChirho]
	}),
	needChirho: one(needsChirho, {
		fields: [donationsChirho.needIdChirho],
		references: [needsChirho.idChirho]
	}),
	donorChirho: one(usersChirho, {
		fields: [donationsChirho.donorIdChirho],
		references: [usersChirho.idChirho]
	})
}));

export const feedbackRelationsChirho = relations(feedbackChirho, ({ one }) => ({
	userChirho: one(usersChirho, {
		fields: [feedbackChirho.userIdChirho],
		references: [usersChirho.idChirho]
	})
}));

export const supportTicketsRelationsChirho = relations(supportTicketsChirho, ({ one }) => ({
	userChirho: one(usersChirho, {
		fields: [supportTicketsChirho.userIdChirho],
		references: [usersChirho.idChirho]
	}),
	assignedToUserChirho: one(usersChirho, {
		fields: [supportTicketsChirho.assignedToChirho],
		references: [usersChirho.idChirho]
	})
}));

export const featureRequestsRelationsChirho = relations(featureRequestsChirho, ({ one, many }) => ({
	submitterChirho: one(usersChirho, {
		fields: [featureRequestsChirho.submittedByChirho],
		references: [usersChirho.idChirho]
	}),
	votesChirho: many(featureVotesChirho)
}));

export const featureVotesRelationsChirho = relations(featureVotesChirho, ({ one }) => ({
	featureChirho: one(featureRequestsChirho, {
		fields: [featureVotesChirho.featureIdChirho],
		references: [featureRequestsChirho.idChirho]
	}),
	userChirho: one(usersChirho, {
		fields: [featureVotesChirho.userIdChirho],
		references: [usersChirho.idChirho]
	})
}));
