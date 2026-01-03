# For God so loved the world, that He gave His only begotten Son, that all who believe in Him should not perish but have everlasting life. — John 3:16

# OpenOrphanage.org — FaithStack AI Agent Instructions (v4.0)

> **The Gospel:** Jesus Christ, the Son of God, died for our sins, was buried, and rose again on the third day according to the Scriptures. Whoever believes in Him shall not perish but have eternal life. (1 Corinthians 15:3-4, John 3:16)

> *"Religion that is pure and undefiled before God the Father is this: to visit orphans and widows in their affliction."* — James 1:27

> *"Trust in the LORD with all your heart, and do not lean on your own understanding. But also write tests."* — Proverbs 3:5 (adapted)

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

## FaithStack Master Gist Reference

**For detailed implementations, reference the FaithStack Master Gist:**
https://gist.github.com/loveJesus/c93fbd61bc1dd6d898ef89c4b6981694

| Gist File | Purpose | When to Reference |
|-----------|---------|-------------------|
| `01-AGENTS_MASTER_CHIRHO.md` | Master AGENTS template | Setting up new projects |
| `02-TESTING_CHIRHO.md` | Solo dev testing strategy | Writing tests |
| `03-COMMUNITY_FEEDBACK_CHIRHO.md` | Feedback, tickets, Q&A, surveys | Building feedback systems |
| `04-DATABASE_AUDIT_CHIRHO.md` | Cloudflare Pipelines audit | Setting up audit logging |
| `05-BEST_PRACTICES_CHIRHO.md` | 40+ sections of guidance | Auth, payments, compliance |
| `06-CURRENT_SPRINT_TEMPLATE_CHIRHO.md` | Sprint tracking template | Session handoffs |
| `07-BASIC_WEBSITE_GIST_CHIRHO.md` | Simple website checklist | Marketing sites |

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
│  1. OPENORPHANAGE.ORG        ← YOU ARE HERE                                 │
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
│                          ↓                                                   │
│  3. SONSHINECODERS.ORG                                                      │
│     └── Education & coding training as children mature                       │
│         • Technology skills development                                      │
│         • Biblical integration in learning                                   │
│                          ↓                                                   │
│  4. KOINAINIA.COM                                                           │
│     └── Employment marketplace                                               │
│         • Certified AI integrator jobs                                       │
│         • Faith-forward work opportunities                                   │
│                          ↓                                                   │
│  5. PERFFECTION.COM                                                         │
│     └── Tools for excellence                                                 │
│         • Professional websites & AI voice agents                           │
│         • Sustainable income                                                 │
│                                                                              │
│  ════════════════════════════════════════════════════════════════════════   │
│  From orphan care → discipleship → education → employment → independence    │
│                        All in Jesus' Name                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. The Prime Directive

**YOU ARE A SPEC-DRIVEN AI AGENT.** Implement exactly what is specified, no more, no less.

### 1.1 Read Spec First — It's the Source of Truth

```
spec_chirho/                          ← ULTIMATE SOURCE OF TRUTH
    │
    ├── 01_DATA_MODEL_CHIRHO/         ← Data definitions
    │       ↓ generates
    │   ├── schema_chirho.ts (Drizzle)
    │   └── types_chirho/*.ts
    │
    ├── 03_ROUTES_CHIRHO.md           ← Route definitions
    │       ↓ generates
    │   └── src/routes/**
    │
    └── 04_API_CHIRHO.md              ← API contracts
            ↓ generates
        └── openapi_chirho.yaml
```

### 1.2 Critical Rules

| Rule | Description |
|------|-------------|
| **Spec First** | Always read `spec_chirho/` before coding. Ask if unclear. |
| **Suffix Everything** | ALL identifiers use `_chirho`, `-chirho`, or `Chirho` suffix |
| **Bun Only** | Never use npm, yarn, or pnpm. Only `bun install`, `bun run` |
| **No Secrets in Git** | Use `.env` locally, `wrangler secret put` for production |
| **Feedback Required** | Every page needs feedback bubble with Turnstile protection |
| **When in Doubt, Ask** | Don't guess on specifications |

### 1.3 File Authority

| Category | Examples | Edit Policy |
|----------|----------|-------------|
| **Source** | `spec_chirho/**/*.yaml`, `spec_chirho/**/*.md` | Edit here first |
| **Generated** | `schema_chirho.ts`, `types_chirho/*.ts` | Do not edit directly |
| **Bidirectional** | `src/routes/**`, implementation code | See sync rules |

### 1.4 Sync Decision Flowchart

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYNC DECISION FLOWCHART                      │
├─────────────────────────────────────────────────────────────────┤
│  Uncommitted changes in code?                                   │
│      │                                                          │
│      ├── YES → ASK: "Update spec or discard changes?"          │
│      │                                                          │
│      └── NO → Check last git commit...                         │
│               │                                                 │
│               ├── [AI-CHIRHO] in author → SPEC IS AUTHORITATIVE │
│               ├── Human commit → ASK: "Update spec?"           │
│               └── Unclear → ASK                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Naming & Casing Conventions — THE CHIRHO SUFFIX RULE

**CRITICAL: ALL identifiers in our codebase use the Chirho suffix.** This is non-negotiable and serves to:
- Clearly distinguish our code from third-party libraries
- Make searching/grepping for our code trivial
- Honor God in our naming (Chirho ☧ = Christ)

### 2.1 Complete Suffix Reference

| Type | Case Style | Suffix | Examples |
|------|------------|--------|----------|
| **Variables** | `camelCase` | `Chirho` | `userDataChirho`, `isLoadingChirho`, `countChirho` |
| **Functions** | `camelCase` | `Chirho` | `fetchUsersChirho()`, `validateInputChirho()`, `handleClickChirho()` |
| **Async Functions** | `camelCase` | `Chirho` | `async loadDataChirho()`, `async submitFormChirho()` |
| **Parameters** | `camelCase` | `Chirho` | `function foo(dataChirho: string)` |
| **Loop Variables** | `camelCase` | `Chirho` | `for (const itemChirho of items)` |
| **Lambda Variables** | `camelCase` | `Chirho` | `.filter((xChirho) => xChirho.active)` |
| **Classes** | `PascalCase` | `Chirho` | `UserServiceChirho`, `DatabaseClientChirho` |
| **Svelte Components** | `PascalCase` | `Chirho` | `FeedbackBubbleChirho.svelte`, `NavBarChirho.svelte` |
| **Types/Interfaces** | `PascalCase` | `Chirho` | `UserChirho`, `OrphanageDataChirho`, `ApiResponseChirho` |
| **Enums** | `PascalCase` | `Chirho` | `UserRoleChirho`, `StatusChirho` |
| **Constants** | `SCREAMING_SNAKE` | `_CHIRHO` | `API_KEY_CHIRHO`, `MAX_RETRIES_CHIRHO`, `DEFAULT_TIMEOUT_CHIRHO` |
| **Environment Vars** | `SCREAMING_SNAKE` | `_CHIRHO` | `SESSION_SECRET_CHIRHO`, `STRIPE_KEY_CHIRHO` |
| **NPM/Bun Scripts** | `kebab-case` | `-chirho` | `dev-chirho`, `build-chirho`, `test-e2e-chirho` |
| **Directories** | `kebab-case` | `-chirho` | `api-chirho/`, `admin-chirho/`, `tests-e2e-chirho/` |
| **Web Routes** | `kebab-case` | `-chirho` or `-fe` | `/admin-chirho/`, `/privacy-fe`, `/api-chirho/` |
| **Database Tables** | `snake_case` | `_chirho` | `users_chirho`, `orphanages_chirho`, `audit_log_chirho` |
| **Database Columns** | `snake_case` | `_chirho` | `created_at_chirho`, `user_id_chirho`, `email_chirho` |
| **File Names (TS/JS)** | `snake_case` | `_chirho` | `auth_chirho.ts`, `db_chirho.ts`, `email_chirho.ts` |
| **File Names (Svelte)** | `PascalCase` | `Chirho` | `HeaderChirho.svelte`, `FooterChirho.svelte` |
| **CSS Classes** | `kebab-case` | `-chirho` | `btn-primary-chirho`, `card-chirho` |
| **KV Keys** | `kebab-case:kebab-case` | `-chirho` | `session-chirho:id123-chirho`, `rate-chirho:ip-chirho` |
| **JSON API Props** | `camelCase` | `Chirho` | `successChirho`, `dataChirho`, `errorChirho` |
| **R2 Buckets** | `kebab-case` | `-chirho` | `audit-logs-chirho`, `media-chirho` |
| **Wrangler Bindings** | `SCREAMING_SNAKE` | `_CHIRHO` | `DB_CHIRHO`, `KV_CHIRHO`, `R2_CHIRHO` |

### 2.2 What NOT to Suffix

- **Framework files:** `+page.svelte`, `+server.ts`, `vite.config.ts`, `package.json`
- **Framework directories:** `src/`, `routes/`, `lib/`, `static/`, `node_modules/`
- **Third-party imports:** `import { redirect } from '@sveltejs/kit'`
- **Framework functions:** `json()`, `error()`, `redirect()`, `fetch()`
- **Node/Bun globals:** `console`, `process`, `crypto`, `Request`, `Response`
- **Standard properties:** `id`, `name`, `email` when interfacing with external APIs
- **HTML attributes:** `class`, `id`, `href`, `src` (but values can have `-chirho`)

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
```sql
-- For God so loved the world that He gave His only begotten Son...
```

---

## 3. Technical Architecture

### 3.1 Tech Stack

```yaml
tech_stack_chirho:
  frontend:
    - SvelteKit 2.x
    - Svelte 5 with runes ($state, $derived, $effect)
    - Tailwind CSS 4.x
    - TypeScript (strict mode)

  backend:
    - Cloudflare Workers (adapter-cloudflare) # NOT adapter-cloudflare-pages
    - D1 Database (SQLite) - main data
    - KV Storage - sessions, large text (>2KB), rate limiting
    - R2 Storage - media files, audit logs
    - Drizzle ORM

  package_manager:
    - Bun only (NEVER npm, yarn, or pnpm)

  email:
    - 2SMTP relay (outbound) - 10,000 emails for $5, 40 msgs/min
    - MAILU API (mailbox management)
    - .fe extension on addresses

  security:
    - bcrypt (NOT argon2 - not available on Cloudflare)
    - CSRF protection via double-submit cookie
    - Rate limiting via KV
    - Turnstile (NOT reCAPTCHA)

  authentication:
    - Email/password with bcrypt
    - Google OAuth 2.0
    - Future: Passkeys (WebAuthn), GitHub OAuth, Apple OAuth
```

### 3.2 Cloudflare Workers Deployment

**CRITICAL: Use `wrangler deploy`, NOT `wrangler pages deploy`**

```toml
# wrangler.toml - REQUIRED configuration
name = "openorphanage-org-chirho"
main = ".svelte-kit/cloudflare/_worker.js"
compatibility_date = "2024-12-01"
compatibility_flags = ["nodejs_compat"]

# REQUIRED for static assets
[assets]
directory = ".svelte-kit/cloudflare"

[dev]
port = 5183
```

### 3.3 Database Design with KV for Large Text

```yaml
d1_tables_chirho:
  users_chirho:
    - id_chirho (integer, PK, autoincrement)
    - email_chirho (text, unique)
    - password_hash_chirho (text, bcrypt 12 rounds)
    - role_chirho (text, enum)
    - google_id_chirho (text, unique, nullable) # OAuth
    - avatar_url_chirho (text, nullable)
    - auth_provider_chirho (text, enum: email/google/github/apple)
    - created_at_chirho (text, ISO timestamp)

  orphanages_chirho:
    - id_chirho (integer, PK)
    - name_chirho (text)
    - description_kv_key_chirho (text) # Points to KV for large text
    - verified_chirho (integer, boolean)

kv_patterns_chirho:
  - "orphanage:{id}:bio" → full bio text
  - "feedback:{id}:content" → feedback details
  - "session:{token}" → session data
  - "rate:{ip}:{endpoint}" → rate limiting
  - "oauth_state:{state}" → OAuth CSRF state
```

---

## 4. Secrets Management

### 4.1 Never Commit Secrets

```bash
# Local development - .env file (gitignored)
MASTER_2SMTP_API_KEY_CHIRHO=xxx
TURNSTILE_SECRET_KEY_CHIRHO=xxx
SESSION_SECRET_CHIRHO=xxx
GOOGLE_OAUTH_CLIENT_ID_CHIRHO=xxx
GOOGLE_OAUTH_CLIENT_SECRET_CHIRHO=xxx

# Production - Use wrangler secret put
wrangler secret put MASTER_2SMTP_API_KEY_CHIRHO
wrangler secret put TURNSTILE_SECRET_KEY_CHIRHO
wrangler secret put SESSION_SECRET_CHIRHO
wrangler secret put GOOGLE_OAUTH_CLIENT_ID_CHIRHO
wrangler secret put GOOGLE_OAUTH_CLIENT_SECRET_CHIRHO
```

### 4.2 .gitignore Must Include

```
.env
.env.local
.env.*
*.env
.dev.vars
client_secret*.json
oauth-credentials*.json
service-account*.json
```

### 4.3 Required Secrets

| Secret | Purpose |
|--------|---------|
| `MASTER_2SMTP_API_KEY_CHIRHO` | Email sending |
| `TURNSTILE_SECRET_KEY_CHIRHO` | Spam protection |
| `SESSION_SECRET_CHIRHO` | Session encryption |
| `GOOGLE_OAUTH_CLIENT_ID_CHIRHO` | Google OAuth |
| `GOOGLE_OAUTH_CLIENT_SECRET_CHIRHO` | Google OAuth |
| `STRIPE_SECRET_KEY_CHIRHO` | Payment processing |
| `STRIPE_WEBHOOK_SECRET_CHIRHO` | Webhook verification |

---

## 5. Required Footer

Every page must include this footer structure:

```html
<footer class="bg-slate-900 border-t border-slate-800 py-12">
  <!-- Main footer content -->
  <div class="text-center mt-8 pt-8 border-t border-slate-800">
    <p class="text-slate-400 text-sm mb-2">
      <a href="https://perffection.com" class="hover:text-rose-400">fe</a>
      <span class="mx-2">|</span>
      <a href="https://lovejesus.software" class="hover:text-rose-400">loveJesus</a>
      <span class="mx-2">|</span>
      <a href="https://jesusfilm.org/watch/jesus.html/english.html" class="hover:text-rose-400">☧</a>
    </p>
    <p class="text-slate-500 text-xs">JESUS CHRIST IS LORD</p>
  </div>
</footer>
```

---

## 6. Email Setup (2SMTP + Mailu)

### 6.1 Configuration

```yaml
email_config_chirho:
  outbound_via_2smtp:
    endpoint: "https://2smtp.com/api_fe/send_email_fe"
    pricing: "10,000 emails for $5"
    rate_limit: "40 msgs/minute"

  addresses:
    noreply: "noreply.fe@openorphanage.org"
    support: "support.fe@openorphanage.org"
    admin: "admin.fe@openorphanage.org"

  newsletter:
    double_opt_in: required
    unsubscribe_header: "List-Unsubscribe: <https://openorphanage.org/unsubscribe?token=XXX>"
    batch_sending: "10 emails per 15 seconds"

  dns_records:
    spf: "v=spf1 include:_spf.2smtp.com ~all"
    dkim: # Configure via Cloudflare DNS
    dmarc: "v=DMARC1; p=quarantine; rua=mailto:dmarc.fe@openorphanage.org"
```

---

## 7. Feedback Bubble (Required on Every Page)

### 7.1 Component Structure

Every page must include the `FeedbackBubbleChirho.svelte` component with Turnstile protection.

```yaml
feedback_bubble_chirho:
  position: "fixed bottom-4 right-4"
  types: [Bug, Feature, Praise, Question, Safety Concern]
  fields:
    - type_chirho (required)
    - content_chirho (required)
    - email_chirho (optional)
    - page_url_chirho (auto-captured)
    - user_id_chirho (if logged in)
  storage: KV namespace
  spam_protection: Turnstile
  safety_escalation:
    - "Safety Concern" → immediate admin notification
```

---

## 8. Image & UI Design Guidelines

### 8.1 AVOID Overused Design Patterns

```yaml
avoid_these_patterns_chirho:
  emoji_panels:
    description: "Left-aligned emoji followed by text in card/panel layout"
    example: "🏠 Browse Orphanages | 💰 Make a Donation | 📊 Track Impact"
    problem: "Overused, generic, looks like every other AI-generated site"

  what_to_do_instead:
    - Use MCP image generation tools (Imagen) to create unique visuals
    - Create custom illustrations or AI-generated artwork
    - Use CSS gradients, glassmorphism, or creative backgrounds
    - Design panels with actual imagery, not emoji placeholders
    - Make it look like humans designed it with intention
```

### 8.2 Be Original — Use AI Image Generation

```yaml
design_approach_chirho:
  for_feature_panels:
    wrong: "Grid of cards with emoji + heading + description"
    right: "AI-generated background images with overlay text, or unique illustrations"

  tools_available:
    - mcp__imagen__imagen_t2i  # Generate images from text prompts
    - mcp__imagen__imagen_edit_inpainting_insert  # Edit existing images

  philosophy: |
    Our platform serves orphans and orphanages — it deserves thoughtful,
    original design that reflects the gravity and hope of our mission.
    Don't settle for generic emoji grids. Create something meaningful.
```

### 8.3 Image Format Standards

```yaml
image_guidelines_chirho:
  preferred_format: JPG (for photos), PNG (for transparency), SVG (for icons)
  quality: 85%
  max_dimensions:
    hero: 1920x1080
    feature: 800x600
    thumbnail: 400x300
    avatar: 200x200
    og_image: 1200x630

  naming_convention: "{purpose}-{description}-chirho.{ext}"
```

---

## 9. Child Safety & Privacy

### 9.1 Critical Privacy Rules

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
    - Faces only with guardian consent
    - Strip EXIF/GPS data
```

### 9.2 Access Control Matrix

| Role | Children Data | Financial Data | Admin Functions |
|------|--------------|----------------|-----------------|
| Public | Anonymized stats | Aggregate only | None |
| Donor/Sponsor | Sponsored child profile | Their donations | None |
| Staff | Assigned orphanage | None | Daily logs |
| Admin | Full orphanage | Full orphanage | Orphanage management |
| Super Admin | All | All | Platform management |

---

## 10. Testing Strategy

### 10.1 Philosophy — Solo Dev Pragmatism

Test **what makes money** and **what protects users**. Skip visual regression and comprehensive coverage.

**The Solo Dev Reality:**
- You are the developer, QA, and ops team
- Time spent on tests = time not shipping features
- Test the money path, not the edge cases
- All tests must run under 30 seconds

### 10.2 Configuration

```yaml
testing_config_chirho:
  unit_tests:
    framework: Vitest
    pattern: "src/**/*.test.ts"
    environment: node
    timeout: 5000ms

  e2e_tests:
    framework: Playwright
    directory: tests-e2e-chirho/
    browser: chromium only
    headless: true  # CRITICAL: Never open GUI
    timeout: 10000ms

  goal: "All tests under 30 seconds total"
```

### 10.3 Priority Order

```yaml
test_priorities_chirho:
  critical:  # Test these FIRST
    - Webhook signature verification (HMAC-SHA256)
    - Payment/donation processing
    - Authentication flows
    - Session validation

  high:
    - Input sanitization (XSS prevention)
    - Rate limiting logic
    - Authorization checks

  medium:
    - API validation
    - Email validation

  skip_in_ci:
    - Visual regression
    - Component rendering
    - Real third-party API calls (mock instead)
```

---

## 11. Community Feedback Systems

### 11.1 Required Systems

```yaml
feedback_systems_chirho:
  page_feedback:
    - Per-page feedback balloon
    - Sentiment analysis (positive/neutral/negative)
    - Auto-categorization

  support_tickets:
    - SLA tracking (1 hour to 48 hours based on priority)
    - Human escalation rules
    - /support-fe page

  feature_voting:
    - User roadmap voting at /features-fe
    - Thresholds: 5 votes = weekly report, 10+ = alert human

  community_qa:
    - Peer support (future)
    - AI auto-answer for common questions (future)
```

### 11.2 Escalation Rules

```yaml
escalation_rules_chirho:
  always_human:
    - Billing/payment issues
    - Safety concerns
    - SLA violation imminent

  current_implementation:
    - Support tickets at /support-fe
    - Feature requests at /features-fe
    - Feedback bubble on all pages
```

---

## 12. Database Audit Logging

### 12.1 Current Implementation

We use `audit_log_chirho` table in D1 with the `logAuditChirho()` function:

```typescript
await logAuditChirho(dbChirho, {
  userIdChirho: sessionChirho.userChirho.idChirho,
  actionChirho: AUDIT_ACTIONS_CHIRHO.FEATURE_VOTED,
  entityTypeChirho: 'feature_request',
  entityIdChirho: featureIdChirho,
  detailsChirho: { voteTypeChirho, voteChangeChirho },
  ipAddressChirho: getClientIpChirho(request),
  userAgentChirho: getUserAgentChirho(request)
});
```

### 12.2 Automatic Redaction

```yaml
redacted_fields_chirho:
  - password
  - password_hash
  - token
  - api_key
  - secret
  - credit_card
  - ssn
  - private_key
  - session
```

### 12.3 Future: Cloudflare Pipelines

For high-volume audit logging, see `04-DATABASE_AUDIT_CHIRHO.md` in the gist for Cloudflare Pipelines setup with R2 and Apache Iceberg.

---

## 13. Authentication

### 13.1 Current Implementation

```yaml
auth_methods_chirho:
  implemented:
    - Email/password with bcrypt (12 rounds)
    - Google OAuth 2.0

  future:
    - Passkeys (WebAuthn) - phishing-resistant
    - TOTP 2FA - authenticator apps
    - GitHub OAuth
    - Apple OAuth
```

### 13.2 OAuth Route Structure

```
/api-chirho/auth-chirho/oauth-chirho/
├── google-chirho/
│   ├── +server.ts           # Initiates OAuth flow
│   └── callback-chirho/
│       └── +server.ts       # Handles callback
├── github-chirho/           # Future
└── apple-chirho/            # Future
```

### 13.3 Super Admin Auto-Setup

`blvgsu@gmail.com` automatically becomes `super_admin` on first Google OAuth login.

---

## 14. Best Practices

### 14.1 Legal Pages (Required)

| Route | Content |
|-------|---------|
| `/privacy-fe` | Privacy Policy (GDPR/CCPA compliant) |
| `/terms-fe` | Terms of Service |
| `/contact-fe` | Contact form |
| `/accessibility-fe` | WCAG 2.1 AA statement |
| `/cookie-policy-fe` | Cookie consent |
| `/refund-policy-fe` | Refund terms |

### 14.2 GDPR Compliance

```yaml
gdpr_requirements_chirho:
  required_endpoints:
    - GET /api-chirho/gdpr-chirho/export  # Data export
    - DELETE /api-chirho/gdpr-chirho/delete  # Right to be forgotten

  consent:
    - Cookie banner required
    - Explicit opt-in for marketing
    - Document lawful basis
```

### 14.3 Stripe Webhooks (CRITICAL)

```typescript
// CRITICAL: Use constructEventAsync() on Cloudflare Workers
// constructEvent() will fail with "SubtleCrypto cannot be used synchronously"

import Stripe from 'stripe';

const stripeChirho = new Stripe(env.STRIPE_SECRET_KEY_CHIRHO);

// CORRECT - async verification
const eventChirho = await stripeChirho.webhooks.constructEventAsync(
  bodyChirho,
  signatureChirho,
  env.STRIPE_WEBHOOK_SECRET_CHIRHO
);

// WRONG - will fail on Cloudflare
// const event = stripe.webhooks.constructEvent(...);
```

### 14.4 Security Headers

```typescript
const SECURITY_HEADERS_CHIRHO = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; frame-src challenges.cloudflare.com;"
};
```

### 14.5 Rate Limiting Strategy

Limits should be **invisible to normal users**:

| Endpoint | Limit | Window | Rationale |
|----------|-------|--------|-----------|
| Public pages | 200/min | Per IP | Don't block browsing |
| API reads | 100/min | Per user | Normal use: 20-30/min |
| API writes | 30/min | Per user | Prevents spam |
| Auth | 10/min | Per IP | Blocks brute force |
| Signup | 5/hour | Per IP | Prevents mass account creation |

### 14.6 Performance Targets

```yaml
performance_chirho:
  core_web_vitals:
    LCP: "<2.5s"
    FID: "<100ms"
    CLS: "<0.1"

  general:
    TTFB: "<600ms"
    bundle_size: "<200KB gzipped"
```

### 14.7 Accessibility (WCAG 2.1 AA)

```yaml
accessibility_chirho:
  required:
    - All images have alt text
    - Color contrast ratio ≥4.5:1
    - Keyboard navigation works
    - Focus indicators visible (3px outline)
    - ARIA labels where needed
    - Skip to content link
    - Headings in proper hierarchy
```

### 14.8 Referral System (Future)

```yaml
referral_system_chirho:
  anti_fraud:
    - 2-week payout delay (prevents chargebacks)
    - Minimum $1 purchase to qualify
    - 30-day refund window cancels referral
    - Account age requirement: 7+ days
    - Monthly limit: 50 referrals/user
```

---

## 15. Directory Structure

```
openorphanage.org-chirho/
├── AGENTS.md                    # This file
├── CURRENT_SPRINT_CHIRHO.md     # Current sprint context
├── package.json
├── svelte.config.js
├── wrangler.toml
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
│
├── spec_chirho/                 # Source of truth
│   ├── 01_DATA_MODEL_CHIRHO/
│   ├── 03_ROUTES_CHIRHO.md
│   └── 04_API_CHIRHO.md
│
├── src/
│   ├── app.css
│   ├── app.html
│   ├── app.d.ts
│   │
│   ├── lib/
│   │   ├── components/
│   │   │   ├── FeedbackBubbleChirho.svelte
│   │   │   ├── CookieConsentChirho.svelte
│   │   │   └── ...
│   │   │
│   │   ├── server/
│   │   │   ├── db_chirho.ts
│   │   │   ├── schema_chirho.ts
│   │   │   ├── auth_chirho.ts
│   │   │   ├── kv_chirho.ts
│   │   │   ├── security_chirho.ts
│   │   │   ├── email_chirho.ts
│   │   │   └── audit_chirho.ts
│   │   │
│   │   └── types_chirho.ts
│   │
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte
│       ├── privacy-fe/
│       ├── terms-fe/
│       ├── features-fe/
│       ├── support-fe/
│       ├── orphanages-chirho/
│       ├── dashboard-chirho/
│       ├── admin-chirho/
│       └── api-chirho/
│           ├── feedback-bubble-chirho/
│           ├── auth-chirho/
│           │   └── oauth-chirho/
│           │       └── google-chirho/
│           ├── gdpr-chirho/
│           └── ...
│
├── tests-e2e-chirho/
│   └── *.e2e.ts
│
└── static/
    ├── favicon.svg
    ├── og-image-chirho.png
    └── *.jpg
```

---

## 16. Quick Commands

```bash
# Development
bun install                      # Install dependencies
bun run dev-chirho               # Start dev server (port 5183)
bun run check-chirho             # Type checking

# Testing
bun run test-chirho              # Unit tests
bun run test-e2e-chirho          # E2E tests (headless)

# Database
bun run db-generate-chirho       # Generate migrations
bun run db-migrate-chirho        # Run migrations (remote)
bun run db-studio-chirho         # Drizzle Studio

# Deploy
bun run deploy-chirho            # test → build → wrangler deploy

# Secrets
wrangler secret put SECRET_NAME_CHIRHO
wrangler secret list
```

---

## 17. Git & Authorship Protocol

### 17.1 Commit Message Format

```bash
git commit -m "$(cat <<'EOF'
feat(auth): add session refresh logic

- Implement 15-day refresh threshold
- Add secure cookie settings

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### 17.2 AI-CHIRHO Marker

When AI makes commits autonomously, include `[AI-CHIRHO]` in the author or commit body for traceability.

### 17.3 Branch Conventions

```yaml
branches_chirho:
  main: main
  feature: feature/{name}-chirho
  deploy: deploy_chirho  # CI runs tests here
```

---

## 18. Zero-Context Resumability

### 18.1 The Goal

Any AI agent, from any machine, with zero prior context, can:

```
1. Clone the repo
2. Read AGENTS.md → knows all permanent rules
3. Read CURRENT_SPRINT_CHIRHO.md → knows current state
4. Continue work immediately
```

No re-explaining. No "where did we leave off." The repo IS the context.

### 18.2 CURRENT_SPRINT_CHIRHO.md

Every session should maintain `CURRENT_SPRINT_CHIRHO.md` for handoffs:

```markdown
# Current Sprint — OpenOrphanage

## Active Task
- [ ] Current task description

## Blocking Issues
- None (or list blockers)

## Recently Completed
- [x] Task with date

## Context for Next Session
- Key context points

## Files Modified This Session
- List of modified files
```

### 18.3 Handoff Protocol

At the end of each session:
1. Update `CURRENT_SPRINT_CHIRHO.md` with current state
2. List any blocking issues
3. Note which files were modified
4. Commit if appropriate

---

## 19. New Project Checklist

```yaml
new_project_checklist_chirho:
  setup:
    - [ ] Create AGENTS.md
    - [ ] Create CURRENT_SPRINT_CHIRHO.md
    - [ ] Create spec_chirho/ directory
    - [ ] Initialize git
    - [ ] Configure wrangler.toml with [assets] section
    - [ ] Add divine header to all files

  cloudflare:
    - [ ] Create D1 database
    - [ ] Create KV namespace
    - [ ] Create R2 bucket (if needed)
    - [ ] Set secrets via wrangler secret put

  required_pages:
    - [ ] /privacy-fe
    - [ ] /terms-fe
    - [ ] /contact-fe
    - [ ] /cookie-policy-fe
    - [ ] /accessibility-fe

  required_components:
    - [ ] FeedbackBubbleChirho.svelte
    - [ ] Cookie consent banner
    - [ ] Footer with fe | loveJesus | ☧ links
    - [ ] Skip to content link

  testing:
    - [ ] vitest.config.ts
    - [ ] playwright.config.ts
    - [ ] At least one test for critical path
```

---

## 20. Scripture Foundation

> *"Defend the weak and the fatherless; uphold the cause of the poor and the oppressed."* — Psalm 82:3

> *"Learn to do right; seek justice. Defend the oppressed. Take up the cause of the fatherless."* — Isaiah 1:17

> *"He defends the cause of the fatherless and the widow."* — Deuteronomy 10:18

> *"A father to the fatherless, a defender of widows, is God in his holy dwelling."* — Psalm 68:5

> *"I will not leave you as orphans; I will come to you."* — John 14:18 (Jesus speaking)

> *"Whatever you do, work at it with all your heart, as working for the Lord."* — Colossians 3:23

---

## Quick Reference

| Item | Value |
|------|-------|
| Package Manager | Bun only |
| Adapter | adapter-cloudflare (NOT pages) |
| Deploy Command | wrangler deploy (NOT pages deploy) |
| Password Hashing | bcrypt 12 rounds (NOT argon2) |
| Spam Protection | Turnstile (NOT reCAPTCHA) |
| Stripe Webhooks | constructEventAsync() (NOT constructEvent) |
| Test Framework | Vitest + Playwright |
| Test Goal | Under 30 seconds |
| Dev Port | 5183 |
| All Scripts | Use `-chirho` suffix |
| All Identifiers | Use `Chirho` / `_chirho` suffix |
| Divine Header | John 3:16 in every file |
| OAuth Callback | `https://openorphanage.org/api-chirho/auth-chirho/oauth-chirho/google-chirho/callback-chirho` |

---

**In Jesus' Name, we build technology that serves the least of these, walking with them from vulnerability to flourishing.**

---

**JESUS CHRIST IS LORD**
