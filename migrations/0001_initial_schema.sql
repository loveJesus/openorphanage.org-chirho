-- For God so loved the world that He gave His only begotten Son...
-- OpenOrphanage Initial Schema Migration
-- Created: 2024-12-31

-- =============================================================================
-- USERS - Platform users (donors, staff, admins)
-- =============================================================================
CREATE TABLE IF NOT EXISTS users_chirho (
    id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
    email_chirho TEXT NOT NULL UNIQUE,
    password_hash_chirho TEXT NOT NULL,
    name_chirho TEXT,
    role_chirho TEXT NOT NULL DEFAULT 'public' CHECK (role_chirho IN ('public', 'donor', 'staff', 'admin', 'super_admin')),
    orphanage_id_chirho INTEGER,
    email_verified_chirho INTEGER NOT NULL DEFAULT 0,
    is_active_chirho INTEGER NOT NULL DEFAULT 1,
    created_at_chirho TEXT NOT NULL DEFAULT '',
    updated_at_chirho TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users_chirho(email_chirho);
CREATE INDEX IF NOT EXISTS idx_users_role ON users_chirho(role_chirho);

-- =============================================================================
-- ORPHANAGES - Registered orphanage facilities
-- =============================================================================
CREATE TABLE IF NOT EXISTS orphanages_chirho (
    id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
    name_chirho TEXT NOT NULL,
    country_chirho TEXT NOT NULL,
    region_chirho TEXT,
    short_description_chirho TEXT,
    description_kv_key_chirho TEXT,
    children_count_chirho INTEGER DEFAULT 0,
    capacity_chirho INTEGER,
    primary_photo_url_chirho TEXT,
    logo_r2_key_chirho TEXT,
    cover_r2_key_chirho TEXT,
    verification_status_chirho TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status_chirho IN ('pending', 'verified', 'rejected')),
    verified_at_chirho TEXT,
    trust_score_chirho REAL DEFAULT 0,
    contact_email_chirho TEXT,
    contact_phone_chirho TEXT,
    website_chirho TEXT,
    is_active_chirho INTEGER NOT NULL DEFAULT 1,
    created_by_chirho INTEGER,
    created_at_chirho TEXT NOT NULL DEFAULT '',
    updated_at_chirho TEXT
);

CREATE INDEX IF NOT EXISTS idx_orphanages_country ON orphanages_chirho(country_chirho);
CREATE INDEX IF NOT EXISTS idx_orphanages_verification ON orphanages_chirho(verification_status_chirho);
CREATE INDEX IF NOT EXISTS idx_orphanages_active ON orphanages_chirho(is_active_chirho);

-- =============================================================================
-- CHILDREN - Anonymized child records (PRIVACY CRITICAL)
-- =============================================================================
CREATE TABLE IF NOT EXISTS children_chirho (
    id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
    orphanage_id_chirho INTEGER NOT NULL,
    pseudonym_chirho TEXT NOT NULL,
    birth_year_chirho INTEGER,
    gender_chirho TEXT CHECK (gender_chirho IN ('male', 'female')),
    status_chirho TEXT NOT NULL DEFAULT 'in_care' CHECK (status_chirho IN ('in_care', 'sponsored', 'transitioning', 'graduated', 'adopted', 'reunified')),
    story_kv_key_chirho TEXT,
    needs_kv_key_chirho TEXT,
    photo_r2_key_chirho TEXT,
    photo_consent_chirho INTEGER NOT NULL DEFAULT 0,
    sponsor_id_chirho INTEGER,
    sponsored_at_chirho TEXT,
    education_level_chirho TEXT,
    career_interests_chirho TEXT,
    is_active_chirho INTEGER NOT NULL DEFAULT 1,
    entry_date_chirho TEXT,
    created_at_chirho TEXT NOT NULL DEFAULT '',
    updated_at_chirho TEXT,
    FOREIGN KEY (orphanage_id_chirho) REFERENCES orphanages_chirho(id_chirho),
    FOREIGN KEY (sponsor_id_chirho) REFERENCES users_chirho(id_chirho)
);

CREATE INDEX IF NOT EXISTS idx_children_orphanage ON children_chirho(orphanage_id_chirho);
CREATE INDEX IF NOT EXISTS idx_children_status ON children_chirho(status_chirho);
CREATE INDEX IF NOT EXISTS idx_children_active ON children_chirho(is_active_chirho);

-- =============================================================================
-- NEEDS - Tracked needs for orphanages and children
-- =============================================================================
CREATE TABLE IF NOT EXISTS needs_chirho (
    id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
    orphanage_id_chirho INTEGER NOT NULL,
    child_id_chirho INTEGER,
    category_chirho TEXT NOT NULL CHECK (category_chirho IN ('food', 'medical', 'education', 'clothing', 'infrastructure', 'staff', 'utilities', 'transportation', 'other')),
    title_chirho TEXT NOT NULL,
    short_description_chirho TEXT,
    description_kv_key_chirho TEXT,
    priority_chirho TEXT NOT NULL DEFAULT 'medium' CHECK (priority_chirho IN ('low', 'medium', 'high', 'urgent')),
    amount_needed_chirho REAL DEFAULT 0,
    amount_raised_chirho REAL DEFAULT 0,
    currency_chirho TEXT NOT NULL DEFAULT 'USD',
    status_chirho TEXT NOT NULL DEFAULT 'active' CHECK (status_chirho IN ('active', 'funded', 'completed', 'cancelled')),
    campaign_id_chirho TEXT,
    fulfilled_at_chirho TEXT,
    created_by_chirho INTEGER,
    created_at_chirho TEXT NOT NULL DEFAULT '',
    updated_at_chirho TEXT,
    FOREIGN KEY (orphanage_id_chirho) REFERENCES orphanages_chirho(id_chirho),
    FOREIGN KEY (child_id_chirho) REFERENCES children_chirho(id_chirho),
    FOREIGN KEY (created_by_chirho) REFERENCES users_chirho(id_chirho)
);

CREATE INDEX IF NOT EXISTS idx_needs_orphanage ON needs_chirho(orphanage_id_chirho);
CREATE INDEX IF NOT EXISTS idx_needs_status ON needs_chirho(status_chirho);
CREATE INDEX IF NOT EXISTS idx_needs_priority ON needs_chirho(priority_chirho);

-- =============================================================================
-- DONATIONS - Track donations from KingdomInvest.ing webhooks
-- =============================================================================
CREATE TABLE IF NOT EXISTS donations_chirho (
    id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id_chirho TEXT UNIQUE,
    orphanage_id_chirho INTEGER,
    need_id_chirho INTEGER,
    donor_id_chirho INTEGER,
    amount_chirho REAL NOT NULL,
    currency_chirho TEXT NOT NULL DEFAULT 'USD',
    status_chirho TEXT NOT NULL DEFAULT 'pending' CHECK (status_chirho IN ('pending', 'completed', 'refunded', 'failed')),
    message_chirho TEXT,
    anonymous_chirho INTEGER NOT NULL DEFAULT 0,
    created_at_chirho TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (orphanage_id_chirho) REFERENCES orphanages_chirho(id_chirho),
    FOREIGN KEY (need_id_chirho) REFERENCES needs_chirho(id_chirho),
    FOREIGN KEY (donor_id_chirho) REFERENCES users_chirho(id_chirho)
);

CREATE INDEX IF NOT EXISTS idx_donations_orphanage ON donations_chirho(orphanage_id_chirho);
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations_chirho(donor_id_chirho);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations_chirho(status_chirho);

-- =============================================================================
-- FEEDBACK - User feedback system
-- =============================================================================
CREATE TABLE IF NOT EXISTS feedback_chirho (
    id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id_chirho INTEGER,
    email_chirho TEXT,
    type_chirho TEXT NOT NULL CHECK (type_chirho IN ('bug', 'feature_request', 'safety_concern', 'general')),
    rating_chirho INTEGER,
    content_preview_chirho TEXT,
    content_kv_key_chirho TEXT,
    is_anonymous_chirho INTEGER NOT NULL DEFAULT 0,
    public_visible_chirho INTEGER NOT NULL DEFAULT 0,
    status_chirho TEXT NOT NULL DEFAULT 'pending' CHECK (status_chirho IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    admin_notes_chirho TEXT,
    created_at_chirho TEXT NOT NULL DEFAULT '',
    resolved_at_chirho TEXT,
    FOREIGN KEY (user_id_chirho) REFERENCES users_chirho(id_chirho)
);

CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback_chirho(type_chirho);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback_chirho(status_chirho);

-- =============================================================================
-- AUDIT LOG - Track all sensitive actions
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_log_chirho (
    id_chirho INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id_chirho INTEGER,
    action_chirho TEXT NOT NULL,
    entity_type_chirho TEXT NOT NULL,
    entity_id_chirho INTEGER,
    details_chirho TEXT,
    ip_address_chirho TEXT,
    user_agent_chirho TEXT,
    created_at_chirho TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (user_id_chirho) REFERENCES users_chirho(id_chirho)
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log_chirho(user_id_chirho);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log_chirho(action_chirho);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log_chirho(entity_type_chirho, entity_id_chirho);

-- JESUS CHRIST IS LORD
