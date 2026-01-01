# For God so loved the world, that He gave His only begotten Son, that all who believe in Him should not perish but have everlasting life. — John 3:16

# OpenOrphanage.org — Chirho AI Agent Instructions

> **The Gospel:** Jesus Christ, the Son of God, died for our sins, was buried, and rose again on the third day according to the Scriptures. Whoever believes in Him shall not perish but have eternal life. (1 Corinthians 15:3-4, John 3:16)

> *"Religion that is pure and undefiled before God the Father is this: to visit orphans and widows in their affliction."* — James 1:27

---

## License

This work is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Purpose

OpenOrphanage is a transparent administration platform for orphanage care sites worldwide. Our mission is to:

1. **Serve orphans** by ensuring care facilities are well-managed, accountable, and child-centered
2. **Empower caregivers** with tools to track needs, manage resources, and report transparently
3. **Build trust** through radical transparency with donors and supporters
4. **Connect the ecosystem** by integrating with FaithStack partners for the complete journey

---

## The Complete Journey — In Jesus' Name

OpenOrphanage is part of a holistic FaithStack ecosystem that walks with children from orphanage care through to gainful employment:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE JOURNEY — GOD WILLING                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. OPENORPHANAGE.ORG                                                       │
│     └── Transparent orphanage administration                                 │
│         • Track children's needs and progress                               │
│         • Manage resources transparently                                     │
│         • Report to donors via KingdomInvest.ing                            │
│                          ↓                                                   │
│  2. MAKINGFRIENDS.FAITH                                                     │
│     └── Child sponsorship & discipleship                                     │
│         • Connect sponsors with children                                     │
│         • Age-appropriate Bible teaching                                     │
│         • 3D Treehouse safe spaces for connection                           │
│         • Holistic care (spiritual, educational, social)                    │
│                          ↓                                                   │
│  3. SONSHINECODERS.ORG                                                      │
│     └── Education & coding training as children mature                       │
│         • Technology skills development                                      │
│         • Biblical integration in learning                                   │
│         • Career preparation                                                 │
│         • Mentorship from Christian developers                              │
│                          ↓                                                   │
│  4. KOINAINIA.COM                                                           │
│     └── Employment marketplace                                               │
│         • Certified AI integrator jobs                                       │
│         • Faith-forward work opportunities                                   │
│         • Portfolio building                                                 │
│         • Client connections                                                 │
│                          ↓                                                   │
│  5. PERFFECTION.COM                                                         │
│     └── Tools for excellence                                                 │
│         • Professional websites                                              │
│         • AI voice agents                                                    │
│         • Business tools                                                     │
│         • Sustainable income                                                 │
│                                                                              │
│  ════════════════════════════════════════════════════════════════════════   │
│  From orphan care → discipleship → education → employment → independence    │
│                        All in Jesus' Name                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. The Prime Directive: Source of Truth & Synchronization

### 1.1 The Hierarchy

The **Spec** (`spec_chirho/`) is the ultimate source of truth. All other artifacts derive from it.

```
spec_chirho/                          ← ULTIMATE SOURCE OF TRUTH
    │
    ├── 01_DATA_MODEL_CHIRHO/         ← Data definitions (YAML files)
    │       ↓ generates
    │   ├── schema_chirho.ts (Drizzle)
    │   ├── types_chirho/*.ts
    │   └── *.HUMAN_CHIRHO.md (readable docs)
    │
    ├── 03_ROUTES_CHIRHO.md           ← Route definitions
    │       ↓ generates
    │   └── src/routes/**
    │
    └── 04_API_CHIRHO.md              ← API contracts (must align with 03)
            ↓ generates
        └── openapi_chirho.yaml
```

### 1.2 File Authority Classification

Files fall into three categories:

| Category | Description | Examples | Edit Policy |
|----------|-------------|----------|-------------|
| **Source** | Canonical definitions | `spec_chirho/**/*.yaml`, `spec_chirho/**/*.md` | Edit here first |
| **Generated** | Derived from Source | `schema_chirho.ts`, `types_chirho/*.ts`, `*.HUMAN_CHIRHO.md` | Do not edit directly |
| **Bidirectional** | Can flow either direction | `src/routes/**`, implementation code | See sync rules below |

### 1.3 The Synchronization Rules

When the AI detects a discrepancy between Spec and Code:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYNC DECISION FLOWCHART                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Is there uncommitted changes in the code?                      │
│      │                                                          │
│      ├── YES → ASK: "You have uncommitted changes. Should I     │
│      │         update the spec to match, or discard changes?"   │
│      │                                                          │
│      └── NO → Check the last git commit...                      │
│               │                                                 │
│               ├── [AI-CHIRHO] in author → SPEC IS AUTHORITATIVE │
│               │   → Auto-update code to match spec              │
│               │                                                 │
│               ├── Human commit (no tag) → CODE IS AUTHORITATIVE │
│               │   → ASK: "Human modified code. Update spec?"    │
│               │                                                 │
│               └── Unclear/ambiguous → ASK                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 The Cardinal Rules

1. **Never silently diverge.** If Spec and Code don't match, stop and resolve.
2. **Spec changes require approval.** Always show changes before implementing.
3. **Human edits are respected.** If a human modified code directly, ask before overwriting.
4. **Context matters.** If the AI knows it just modified a file in this session, it can auto-sync without checking git.
5. **When in doubt, ask.**

---

## 2. Naming & Casing Conventions

All project-created identifiers use the `_chirho` or `-chirho` suffix to distinguish from third-party code.

### 2.1 The Suffix Rule

| Type | Case Style | Suffix | Example |
|------|------------|--------|---------|
| **Variables/Functions (JS/TS)** | `camelCase` | `Chirho` | `userDataChirho`, `fetchUsersChirho()` |
| **Classes/Components/Types** | `PascalCase` | `Chirho` | `UserProfileChirho`, `ChurchFormChirho` |
| **Constants/Env Vars** | `SCREAMING_SNAKE` | `_CHIRHO` | `API_KEY_CHIRHO`, `MAX_RETRIES_CHIRHO` |
| **NPM/Bun Scripts** | `kebab-case` | `-chirho` | `build-prod-chirho`, `test-e2e-chirho` |
| **Directories (project-created)** | `snake_case` or `kebab-case` | `_chirho` or `-chirho` | `services_chirho/`, `api-chirho/` |
| **Web Routes/Paths** | `kebab-case` | `-chirho` | `/admin-chirho/users-chirho/` |
| **API Endpoints** | `kebab-case` | `-chirho` | `/api-chirho/widgets-chirho/` |
| **Database Tables/Columns** | `snake_case` | `_chirho` | `users_chirho`, `created_at_chirho` |
| **File Names** | Match language convention | `_chirho` or `-chirho` | `auth_chirho.ts`, `user-form-chirho.svelte` |

### 2.2 Framework Directories (No Suffix)

Directories required by frameworks keep their standard names:

| Framework | Required Directories |
|-----------|---------------------|
| SvelteKit | `src/`, `routes/`, `lib/`, `static/` |

**Principle:** Suffix what *we* create. Leave framework conventions alone.

### 2.3 The Divine Header

Every project file must include John 3:16 at the top:

```javascript
// For God so loved the world that He gave His only begotten Son...
```
```html
<!-- For God so loved the world that He gave His only begotten Son... -->
```
```yaml
# For God so loved the world that He gave His only begotten Son...
```

---

## 3. Technical Architecture

### 3.1 Tech Stack

```yaml
tech_stack_chirho:
  frontend:
    - SvelteKit 2.x
    - Svelte 5 with runes
    - Tailwind CSS 4.x
    - TypeScript

  backend:
    - Cloudflare Workers (adapter-cloudflare)
    - D1 Database (SQLite) - main data
    - KV Storage - large text columns (>2KB), sessions
    - R2 Storage - media files, documents
    - Drizzle ORM

  email:
    - 2SMTP relay (outbound)
    - MAILU API (mailbox management)
    - .fe extension on addresses (noreply.fe@openorphanage.org)

  security:
    - bcrypt (NOT argon2 - not available on Cloudflare)
    - CSRF protection
    - Rate limiting via KV
    - Content Security Policy
```

### 3.2 Database Design with KV for Large Text

```yaml
d1_tables_chirho:
  # Small data in D1
  users_chirho:
    - user_id_chirho (uuid, PK)
    - email_chirho (string)
    - password_hash_chirho (string, bcrypt)
    - role_chirho (enum)
    - created_at_chirho (timestamp)

  orphanages_chirho:
    - orphanage_id_chirho (uuid, PK)
    - name_chirho (string)
    - location_chirho (string)
    - bio_kv_key_chirho (string) # Points to KV for large text
    - verified_chirho (boolean)

  children_chirho:
    - child_id_chirho (uuid, PK)
    - orphanage_id_chirho (uuid, FK)
    - pseudonym_chirho (string) # Privacy: no real names
    - birth_year_chirho (int) # Privacy: no exact dates
    - story_kv_key_chirho (string) # Large text in KV
    - photo_r2_key_chirho (string) # Media in R2

kv_patterns_chirho:
  # Large text stored in KV with keys like:
  - "orphanage:{id}:bio" → full bio text
  - "child:{id}:story" → child's story
  - "feedback:{id}:content" → feedback details
  - "session:{token}" → session data
  - "rate:{ip}:{endpoint}" → rate limiting
```

### 3.3 Email Configuration

```yaml
email_config_chirho:
  outbound_via_2smtp:
    relay_host: "smtp.2smtp.com"
    port: 587
    auth:
      api_key: MASTER_2SMT_MASTER_API_KEY_CHIRHO

  addresses:
    noreply: "noreply.fe@openorphanage.org"
    support: "support.fe@openorphanage.org"
    admin: "admin.fe@openorphanage.org"

  dns_records:
    spf: "v=spf1 include:_spf.2smtp.com ~all"
    dkim: # Configure via Cloudflare DNS
    dmarc: "v=DMARC1; p=quarantine; rua=mailto:dmarc.fe@openorphanage.org"
```

---

## 4. Child Safety & Privacy

### 4.1 Critical Privacy Rules

```yaml
child_privacy_chirho:
  never_expose:
    - Full legal names (use pseudonyms only)
    - Exact birth dates (use birth year only)
    - Exact location (use region/country only)
    - Family details
    - Medical specifics
    - Trauma history details

  photo_rules:
    - Explicit consent required
    - No identifying backgrounds
    - Faces may be shown only with guardian consent
    - Stored in R2 with access controls
    - No EXIF/GPS data

  communication_rules:
    - All sponsor messages moderated before delivery
    - AI-assisted content filtering
    - No direct contact information shared
    - Video calls only through platform (future)
```

### 4.2 Access Control Matrix

| Role | Children Data | Financial Data | Admin Functions |
|------|--------------|----------------|-----------------|
| Public | Anonymized stats | Aggregate only | None |
| Donor/Sponsor | Sponsored child profile | Their donations | None |
| Staff | Assigned orphanage | None | Daily logs |
| Admin | Full orphanage | Full orphanage | Orphanage management |
| Super Admin | All | All | Platform management |

---

## 5. Core Features

### 5.1 Feedback System (from guide)

```yaml
feedback_system_chirho:
  form_fields:
    - category_chirho: [Bug, Feature, General, Safety Concern]
    - rating_chirho: 1-5 stars (optional)
    - content_chirho: text (stored in KV if >2KB)
    - anonymous_chirho: boolean
    - public_visible_chirho: boolean

  routes:
    - GET /feedback-chirho → view public feedback
    - POST /api-chirho/feedback-chirho → submit feedback
    - GET /admin-chirho/feedback-chirho → manage feedback

  safety_escalation:
    - "Safety Concern" category → immediate admin notification
    - Email to admin.fe@openorphanage.org
```

### 5.2 Dashboard Features

```yaml
dashboard_features_chirho:
  orphanage_admin:
    - Child management (pseudonymized)
    - Staff management
    - Needs tracking
    - Financial reporting
    - Donor communication

  donor_view:
    - Sponsored child updates
    - Impact metrics
    - Donation history
    - Communication center
```

### 5.3 API Endpoints

```yaml
api_endpoints_chirho:
  public:
    GET /api-chirho/orphanages-chirho         # List verified orphanages
    GET /api-chirho/needs-chirho              # Current needs (for KingdomInvest.ing)
    GET /api-chirho/impact-chirho             # Aggregate impact metrics
    POST /api-chirho/feedback-chirho          # Submit feedback

  authenticated:
    # Auth
    POST /api-chirho/auth-chirho/register     # Register
    POST /api-chirho/auth-chirho/login        # Login
    POST /api-chirho/auth-chirho/logout       # Logout

    # Orphanage management
    POST /api-chirho/orphanages-chirho        # Register orphanage
    PUT /api-chirho/orphanages-chirho/:id     # Update orphanage

    # Child management (admin only)
    GET /api-chirho/children-chirho           # List children
    POST /api-chirho/children-chirho          # Add child
    PUT /api-chirho/children-chirho/:id       # Update child

  webhooks:
    POST /webhook-chirho/kingdominvest        # Donation notifications
    POST /webhook-chirho/makingfriends        # Sponsorship updates
```

---

## 6. Legal Pages (Required)

```yaml
legal_pages_chirho:
  required:
    - /privacy-fe → Privacy Policy
    - /terms-fe → Terms of Service
    - /contact-fe → Contact form
    - /accessibility-fe → WCAG 2.1 AA statement

  content_requirements:
    privacy:
      - Data collection practices
      - Child data protection measures
      - GDPR/CCPA compliance
      - Data retention policies
      - Export/deletion rights

    terms:
      - User responsibilities
      - Content guidelines
      - Prohibited activities
      - Liability limitations
```

---

## 7. Color Scheme

```yaml
colors_chirho:
  primary:
    rose: "#f43f5e"      # Compassion, love
    teal: "#14b8a6"      # Trust, growth

  secondary:
    amber: "#f59e0b"     # Hope, warmth
    purple: "#8b5cf6"    # Dignity, royalty
    emerald: "#10b981"   # Life, flourishing

  semantic:
    success: "#22c55e"
    warning: "#f59e0b"
    error: "#ef4444"
    info: "#3b82f6"

  gradients:
    compassion: "from-rose-500 to-pink-600"
    trust: "from-teal-500 to-cyan-600"
    hope: "from-amber-500 to-orange-600"
    journey: "from-rose-500 via-purple-500 via-amber-500 to-emerald-500"
```

---

## 8. Directory Structure

```
openorphanage.org-chirho/
├── AGENTS.md                    # This file
├── package.json
├── svelte.config.js
├── wrangler.toml
├── vite.config.ts
│
├── src/
│   ├── app.css                  # Tailwind + custom styles
│   ├── app.html
│   ├── app.d.ts                 # Cloudflare bindings
│   │
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui-chirho/       # Reusable UI components
│   │   │   ├── FeedbackFormChirho.svelte
│   │   │   ├── OrphanageCardChirho.svelte
│   │   │   ├── ChildProfileChirho.svelte
│   │   │   └── DashboardChirho.svelte
│   │   │
│   │   ├── server/
│   │   │   ├── db_chirho.ts           # Drizzle + D1
│   │   │   ├── schema_chirho.ts       # Database schema
│   │   │   ├── kv_chirho.ts           # KV helpers
│   │   │   ├── r2_chirho.ts           # R2 helpers
│   │   │   ├── auth_chirho.ts         # Auth (bcrypt)
│   │   │   ├── email_chirho.ts        # 2SMTP/MAILU
│   │   │   └── security_chirho.ts     # CSRF, rate limiting
│   │   │
│   │   └── types_chirho.ts
│   │
│   └── routes/
│       ├── +layout.svelte
│       ├── +layout.server.ts
│       ├── +page.svelte              # Landing page
│       │
│       ├── privacy-fe/
│       ├── terms-fe/
│       ├── contact-fe/
│       │
│       ├── feedback-chirho/
│       │   └── +page.svelte
│       │
│       ├── orphanages-chirho/
│       │   ├── +page.svelte          # Browse orphanages
│       │   └── [id_chirho]/
│       │       └── +page.svelte      # Orphanage detail
│       │
│       ├── auth-chirho/
│       │   ├── login-chirho/
│       │   ├── register-chirho/
│       │   └── logout-chirho/
│       │
│       ├── dashboard-chirho/
│       │   ├── +page.svelte
│       │   ├── children-chirho/
│       │   ├── needs-chirho/
│       │   └── finances-chirho/
│       │
│       ├── admin-chirho/
│       │   ├── +page.svelte
│       │   ├── feedback-chirho/
│       │   ├── users-chirho/
│       │   └── orphanages-chirho/
│       │
│       └── api-chirho/
│           ├── auth-chirho/
│           ├── orphanages-chirho/
│           ├── children-chirho/
│           ├── feedback-chirho/
│           ├── needs-chirho/
│           └── webhook-chirho/
│
└── static/
    ├── favicon.svg
    └── images/
```

---

## 9. Development Commands

```bash
# Install dependencies
bun install

# Development server (port 5183)
bun run dev

# Build for production
bun run build

# Deploy to Cloudflare Workers
bun run deploy-chirho

# Type checking
bun run check

# Testing
bun run test-chirho            # Run unit tests (Vitest)
bun run test-watch-chirho      # Run tests in watch mode
bun run test-e2e-chirho        # Run E2E tests (Playwright)
bun run test-all-chirho        # Run all tests

# Database commands (when D1 is set up)
bun run db:generate-chirho     # Generate migrations
bun run db:migrate-chirho      # Run migrations
bun run db:studio-chirho       # Drizzle Studio
```

---

## 10. Testing Strategy

### 10.1 Test Configuration

```yaml
testing_config_chirho:
  unit_tests:
    framework: Vitest
    config_file: vitest.config.ts
    test_pattern: "src/**/*.test.ts"
    environment: node  # No browser/jsdom needed for server tests
    timeout: 5000ms per test

  e2e_tests:
    framework: Playwright
    config_file: playwright.config.ts
    test_directory: tests-e2e-chirho/
    test_pattern: "**/*.e2e.ts"
    browser: chromium only (speed)
    headless: true  # CRITICAL: Always headless, no GUI popups
    timeout: 10000ms per test

  deploy:
    command: "bun run deploy-chirho"
    flow: "test-chirho → build → wrangler deploy"
    goal: All tests under 30 seconds total
```

### 10.2 Test File Locations

```
openorphanage.org-chirho/
├── src/lib/server/
│   ├── security_chirho.ts           # Security utilities
│   ├── security_chirho.test.ts      # Unit tests
│   ├── auth_chirho.ts               # Authentication
│   ├── auth_chirho.test.ts          # Unit tests
│   └── webhook_chirho.test.ts       # Webhook tests
│
└── tests-e2e-chirho/
    ├── homepage.e2e.ts              # Homepage & navigation
    └── auth.e2e.ts                  # Authentication flows
```

### 10.3 Testing Focus Areas

```yaml
test_coverage_priorities_chirho:
  high_priority:
    - Webhook signature verification (HMAC-SHA256)
    - Input sanitization (XSS prevention)
    - Authentication flows
    - Rate limiting logic

  medium_priority:
    - Email validation
    - UUID validation
    - Session management
    - Protected route access

  e2e_scenarios:
    - Homepage loads correctly
    - Login/register forms work
    - Protected routes redirect
    - Feedback submission
```

### 10.4 Running Tests

```bash
# Unit tests only (fast)
bun run test-chirho

# Watch mode for development
bun run test-watch-chirho

# E2E tests (starts dev server automatically)
bun run test-e2e-chirho

# All tests
bun run test-all-chirho

# Deploy with tests (recommended)
bun run deploy-chirho  # Runs: test-chirho → build → wrangler deploy
```

---

## 11. Git & Authorship Protocol

### 11.1 Commit Message Format

```bash
git commit --author="User Name [AI-CHIRHO] <user@email.com>" -m "$(cat <<'EOFCHIRHO'
feat(auth): add session refresh logic

- Implement 15-day refresh threshold
- Add secure cookie settings

Assisted-By: Claude <noreply@anthropic.com>
JESUS CHRIST IS LORD
EOFCHIRHO
)"
```

The `[AI-CHIRHO]` marker enables programmatic detection of AI-assisted commits.

---

## 12. Security Notes

### 12.1 Cloudflare-Compatible Security

```yaml
security_notes_chirho:
  password_hashing:
    # IMPORTANT: Argon2 is NOT available on Cloudflare Workers
    # Use bcrypt instead
    algorithm: bcrypt
    rounds: 12

  session_management:
    storage: KV
    token_format: crypto.randomUUID()
    expiry: 30 days
    refresh: at 15 days

  rate_limiting:
    storage: KV
    key_format: "rate:{ip}:{endpoint}"
    limits:
      login: 5 per minute
      register: 3 per hour
      feedback: 10 per hour

  csrf:
    enabled: true
    token_in: cookie + form field
```

---

## 13. Scripture Foundation

> *"Defend the weak and the fatherless; uphold the cause of the poor and the oppressed."* — Psalm 82:3

> *"Learn to do right; seek justice. Defend the oppressed. Take up the cause of the fatherless."* — Isaiah 1:17

> *"He defends the cause of the fatherless and the widow."* — Deuteronomy 10:18

> *"A father to the fatherless, a defender of widows, is God in his holy dwelling."* — Psalm 68:5

> *"I will not leave you as orphans; I will come to you."* — John 14:18 (Jesus speaking)

---

**In Jesus' Name, we build technology that serves the least of these, walking with them from vulnerability to flourishing.**

---

**JESUS CHRIST IS LORD**
