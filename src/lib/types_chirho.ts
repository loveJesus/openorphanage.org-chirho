// For God so loved the world that He gave His only begotten Son...

// =============================================================================
// USER TYPES
// =============================================================================

export type UserRoleChirho = 'public' | 'donor' | 'staff' | 'admin' | 'super_admin';

export interface UserChirho {
	userIdChirho: string;
	emailChirho: string;
	nameChirho: string;
	roleChirho: UserRoleChirho;
	orphanageIdChirho?: string;
	emailVerifiedChirho: boolean;
	createdAtChirho: Date;
}

// =============================================================================
// ORPHANAGE TYPES
// =============================================================================

export interface OrphanageChirho {
	orphanageIdChirho: string;
	nameChirho: string;
	countryChirho: string;
	regionChirho?: string;
	capacityChirho?: number;
	currentCountChirho: number;
	bioChirho?: string; // Fetched from KV
	missionChirho?: string; // Fetched from KV
	logoUrlChirho?: string;
	coverUrlChirho?: string;
	verifiedChirho: boolean;
	verifiedAtChirho?: Date;
	trustScoreChirho: number;
	createdAtChirho: Date;
}

export interface OrphanagePublicChirho {
	orphanageIdChirho: string;
	nameChirho: string;
	countryChirho: string;
	regionChirho?: string;
	currentCountChirho: number;
	bioChirho?: string;
	logoUrlChirho?: string;
	verifiedChirho: boolean;
	trustScoreChirho: number;
}

// =============================================================================
// CHILD TYPES (PRIVACY-CONSCIOUS)
// =============================================================================

export type ChildStatusChirho = 'in_care' | 'sponsored' | 'transitioning' | 'graduated' | 'adopted' | 'reunified';

// Full child record (admin/staff only)
export interface ChildChirho {
	childIdChirho: string;
	orphanageIdChirho: string;
	pseudonymChirho: string;
	birthYearChirho?: number;
	genderChirho?: 'male' | 'female';
	statusChirho: ChildStatusChirho;
	storyChirho?: string; // From KV
	needsChirho?: string; // From KV
	photoUrlChirho?: string;
	photoConsentChirho: boolean;
	sponsorIdChirho?: string;
	sponsoredAtChirho?: Date;
	educationLevelChirho?: string;
	careerInterestsChirho?: string;
	entryDateChirho?: Date;
	createdAtChirho: Date;
}

// Public/sponsor view (privacy-respecting)
export interface ChildPublicChirho {
	childIdChirho: string;
	pseudonymChirho: string;
	ageRangeChirho: string; // e.g., "5-7 years" computed from birthYear
	genderChirho?: 'male' | 'female';
	statusChirho: ChildStatusChirho;
	storyExcerptChirho?: string; // Truncated version
	photoUrlChirho?: string; // Only if consent given
	isSponsored: boolean;
}

// =============================================================================
// NEED TYPES
// =============================================================================

export type NeedCategoryChirho = 'food' | 'medical' | 'education' | 'clothing' | 'facility' | 'staff' | 'other';
export type NeedPriorityChirho = 'low' | 'medium' | 'high' | 'urgent';
export type NeedStatusChirho = 'open' | 'partial' | 'fulfilled' | 'cancelled';

export interface NeedChirho {
	needIdChirho: string;
	orphanageIdChirho: string;
	childIdChirho?: string;
	categoryChirho: NeedCategoryChirho;
	titleChirho: string;
	descriptionChirho?: string;
	detailsChirho?: string; // From KV
	estimatedCostChirho?: number;
	priorityChirho: NeedPriorityChirho;
	statusChirho: NeedStatusChirho;
	campaignIdChirho?: string;
	fulfilledAmountChirho: number;
	fulfilledAtChirho?: Date;
	createdAtChirho: Date;
}

export interface NeedPublicChirho {
	needIdChirho: string;
	orphanageNameChirho: string;
	categoryChirho: NeedCategoryChirho;
	titleChirho: string;
	descriptionChirho?: string;
	estimatedCostChirho?: number;
	priorityChirho: NeedPriorityChirho;
	statusChirho: NeedStatusChirho;
	fulfilledAmountChirho: number;
	percentFundedChirho: number;
}

// =============================================================================
// FEEDBACK TYPES
// =============================================================================

export type FeedbackCategoryChirho = 'bug' | 'feature' | 'general' | 'safety_concern';
export type FeedbackStatusChirho = 'new' | 'reviewed' | 'in_progress' | 'resolved' | 'closed';

export interface FeedbackChirho {
	feedbackIdChirho: string;
	userIdChirho?: string;
	categoryChirho: FeedbackCategoryChirho;
	ratingChirho?: number;
	contentChirho: string;
	anonymousChirho: boolean;
	publicVisibleChirho: boolean;
	statusChirho: FeedbackStatusChirho;
	adminNotesChirho?: string;
	createdAtChirho: Date;
	resolvedAtChirho?: Date;
}

export interface FeedbackPublicChirho {
	feedbackIdChirho: string;
	categoryChirho: FeedbackCategoryChirho;
	ratingChirho?: number;
	contentChirho: string;
	createdAtChirho: Date;
}

export interface FeedbackFormDataChirho {
	categoryChirho: FeedbackCategoryChirho;
	ratingChirho?: number;
	contentChirho: string;
	anonymousChirho: boolean;
	publicVisibleChirho: boolean;
}

// =============================================================================
// DONATION TYPES
// =============================================================================

export type DonationStatusChirho = 'pending' | 'completed' | 'refunded' | 'failed';

export interface DonationChirho {
	donationIdChirho: string;
	externalIdChirho?: string;
	orphanageIdChirho?: string;
	needIdChirho?: string;
	donorIdChirho?: string;
	amountChirho: number;
	currencyChirho: string;
	statusChirho: DonationStatusChirho;
	messageChirho?: string;
	anonymousChirho: boolean;
	createdAtChirho: Date;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponseChirho<T = unknown> {
	successChirho: boolean;
	dataChirho?: T;
	errorChirho?: string;
	codeChirho?: string;
}

export interface PaginatedResponseChirho<T> {
	dataChirho: T[];
	paginationChirho: {
		pageChirho: number;
		limitChirho: number;
		totalChirho: number;
		totalPagesChirho: number;
	};
}

// =============================================================================
// FORM TYPES
// =============================================================================

export interface LoginFormChirho {
	emailChirho: string;
	passwordChirho: string;
}

export interface RegisterFormChirho {
	emailChirho: string;
	passwordChirho: string;
	confirmPasswordChirho: string;
	nameChirho: string;
}

export interface OrphanageFormChirho {
	nameChirho: string;
	countryChirho: string;
	regionChirho?: string;
	capacityChirho?: number;
	bioChirho?: string;
	missionChirho?: string;
	contactEmailChirho: string;
	contactPhoneChirho?: string;
}

export interface ChildFormChirho {
	pseudonymChirho: string;
	birthYearChirho?: number;
	genderChirho?: 'male' | 'female';
	storyChirho?: string;
	educationLevelChirho?: string;
	careerInterestsChirho?: string;
}

export interface NeedFormChirho {
	categoryChirho: NeedCategoryChirho;
	titleChirho: string;
	descriptionChirho?: string;
	detailsChirho?: string;
	estimatedCostChirho?: number;
	priorityChirho: NeedPriorityChirho;
	childIdChirho?: string;
}

// =============================================================================
// IMPACT METRICS
// =============================================================================

export interface ImpactMetricsChirho {
	totalOrphanagesChirho: number;
	verifiedOrphanagesChirho: number;
	totalChildrenChirho: number;
	sponsoredChildrenChirho: number;
	graduatedChildrenChirho: number;
	openNeedsChirho: number;
	fulfilledNeedsChirho: number;
	totalDonationsChirho: number;
	totalDonationAmountChirho: number;
}
