# For God so loved the world, that He gave His only begotten Son, that all who believe in Him should not perish but have everlasting life. — John 3:16

# OpenOrphanage.org — FaithStack AI Agent Instructions (v2.0)

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

## 2. Naming & Casing Conventions

**ALL** our identifiers use `_chirho`, `-chirho`, or `Chirho` suffix to distinguish from third-party code.

### 2.1 The Suffix Rule

| Type | Case Style | Suffix | Example |
|------|------------|--------|---------|
| **Variables/Functions** | `camelCase` | `Chirho` | `userDataChirho`, `fetchUsersChirho()` |
| **Classes/Components/Types** | `PascalCase` | `Chirho` | `UserProfileChirho`, `FeedbackFormChirho` |
| **Constants/Env Vars** | `SCREAMING_SNAKE` | `_CHIRHO` | `API_KEY_CHIRHO`, `MAX_RETRIES_CHIRHO` |
| **NPM/Bun Scripts** | `kebab-case` | `-chirho` | `build-prod-chirho`, `test-e2e-chirho` |
| **Directories** | `kebab-case` | `-chirho` | `api-chirho/`, `admin-chirho/` |
| **Web Routes** | `kebab-case` | `-chirho` or `-fe` | `/admin-chirho/`, `/privacy-fe` |
| **Database Tables/Columns** | `snake_case` | `_chirho` | `users_chirho`, `created_at_chirho` |
| **File Names** | Match language | `_chirho` or `-chirho` | `auth_chirho.ts`, `FeedbackChirho.svelte` |

### 2.2 Framework Directories (No Suffix)

Keep standard names: `src/`, `routes/`, `lib/`, `static/`, `node_modules/`

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
    - Cloudflare Workers (adapter-cloudflare) # NOT adapter-cloudflare-pages
    - D1 Database (SQLite) - main data
    - KV Storage - sessions, large text (>2KB), rate limiting
    - R2 Storage - media files, audit logs
    - Drizzle ORM

  package_manager:
    - Bun only (NEVER npm, yarn, or pnpm)

  email:
    - 2SMTP relay (outbound) - 10,000 emails for $5
    - MAILU API (mailbox management)
    - .fe extension on addresses

  security:
    - bcrypt (NOT argon2 - not available on Cloudflare)
    - CSRF protection
    - Rate limiting via KV
    - Turnstile (NOT reCAPTCHA)
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
    - user_id_chirho (uuid, PK)
    - email_chirho (string)
    - password_hash_chirho (string, bcrypt 12 rounds)
    - role_chirho (enum)
    - created_at_chirho (timestamp)

  orphanages_chirho:
    - orphanage_id_chirho (uuid, PK)
    - name_chirho (string)
    - bio_kv_key_chirho (string) # Points to KV for large text
    - verified_chirho (boolean)

kv_patterns_chirho:
  - "orphanage:{id}:bio" → full bio text
  - "feedback:{id}:content" → feedback details
  - "session:{token}" → session data
  - "rate:{ip}:{endpoint}" → rate limiting
```

---

## 4. Secrets Management

### 4.1 Never Commit Secrets

```bash
# Local development - .env file (gitignored)
MASTER_2SMTP_API_KEY_CHIRHO=xxx
TURNSTILE_SECRET_KEY_CHIRHO=xxx
SESSION_SECRET_CHIRHO=xxx
KINGDOM_INVEST_WEBHOOK_SECRET_CHIRHO=xxx

# Production - Use wrangler secret put
wrangler secret put MASTER_2SMTP_API_KEY_CHIRHO
wrangler secret put TURNSTILE_SECRET_KEY_CHIRHO
wrangler secret put SESSION_SECRET_CHIRHO
wrangler secret put KINGDOM_INVEST_WEBHOOK_SECRET_CHIRHO
```

### 4.2 Required Secrets

| Secret | Purpose |
|--------|---------|
| `MASTER_2SMTP_API_KEY_CHIRHO` | Email sending |
| `TURNSTILE_SECRET_KEY_CHIRHO` | Spam protection |
| `SESSION_SECRET_CHIRHO` | Session encryption |
| `KINGDOM_INVEST_WEBHOOK_SECRET_CHIRHO` | Webhook verification |

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
    relay_host: "smtp.2smtp.com"
    port: 587
    pricing: "10,000 emails for $5"
    rate_limit: "100/minute"

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

## 7. Feedback Bubble (Required on Every Page)

### 7.1 Component Structure

Every page must include the `FeedbackBubbleChirho.svelte` component with Turnstile protection.

```yaml
feedback_bubble_chirho:
  position: "fixed bottom-4 right-4"
  types: [Bug, Feature, Praise, Question]
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

### 7.2 API Endpoint

```typescript
// POST /api-chirho/feedback-bubble-chirho
// Validates Turnstile, stores in KV, logs metadata
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

  css_techniques:
    - Background images with gradient overlays
    - Glassmorphism (backdrop-blur)
    - Creative clip-paths and shapes
    - Animated gradients
    - Custom SVG patterns

  philosophy: |
    Our platform serves orphans and orphanages — it deserves thoughtful,
    original design that reflects the gravity and hope of our mission.
    Don't settle for generic emoji grids. Create something meaningful.
```

### 8.3 Image Format Standards

```yaml
image_guidelines_chirho:
  preferred_format: JPG
  quality: 85%
  max_dimensions:
    hero: 1920x1080
    thumbnail: 400x300
    avatar: 200x200

  reasons:
    - Smaller file size than PNG for photos
    - Faster page loads
    - Better for SEO

  exceptions:
    - Icons/logos with transparency → PNG
    - Simple graphics → SVG
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

### 10.1 Philosophy

Test **what makes money** and **what protects users**. Skip visual regression and comprehensive coverage.

### 10.2 Configuration

```yaml
testing_config_chirho:
  unit_tests:
    framework: Vitest
    config_file: vitest.config.ts
    pattern: "src/**/*.test.ts"
    environment: node
    timeout: 5000ms

  e2e_tests:
    framework: Playwright
    config_file: playwright.config.ts
    directory: tests-e2e-chirho/
    pattern: "**/*.e2e.ts"
    browser: chromium only
    headless: true  # CRITICAL: Never open GUI
    timeout: 10000ms

  goal: "All tests under 30 seconds total"
```

### 10.3 Priority Order

```yaml
test_priorities_chirho:
  critical:  # Test these first
    - Webhook signature verification (HMAC-SHA256)
    - Payment/donation processing
    - Authentication flows

  high:
    - Input sanitization (XSS prevention)
    - Rate limiting logic
    - Session management

  medium:
    - API validation
    - Email validation
    - UUID validation

  skip_in_ci:
    - Visual regression
    - Component rendering
    - Real third-party API calls (mock instead)
```

### 10.4 Scripts

```bash
bun run test-chirho         # Unit tests only (fast)
bun run test-watch-chirho   # Watch mode
bun run test-e2e-chirho     # E2E tests (headless)
bun run test-all-chirho     # All tests
bun run deploy-chirho       # test → build → wrangler deploy
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
    - SLA tracking (1 hour to 1 week based on priority)
    - Human escalation rules
    - AI auto-response after 30 minutes

  feature_voting:
    - User roadmap voting
    - Thresholds: 5 votes = weekly report, 10+ = alert human

  community_qa:
    - Peer support forum
    - AI auto-answer for common questions
```

### 11.2 Escalation Rules

```yaml
escalation_rules_chirho:
  always_human:
    - Billing/payment issues
    - Safety concerns
    - Low AI confidence (<70%)
    - SLA violation imminent

  ai_monitoring:
    cron: "*/5 * * * *"  # Every 5 minutes
    daily_digest: "0 8 * * *"  # 8am UTC
```

---

## 12. Database Audit Logging

### 12.1 Using Cloudflare Pipelines

```yaml
audit_logging_chirho:
  storage: Cloudflare Pipelines → R2 (Apache Iceberg)

  logged_operations:
    - INSERT
    - UPDATE
    - DELETE

  captured_fields:
    - timestamp_chirho
    - user_id_chirho
    - operation_chirho
    - table_chirho
    - record_id_chirho
    - changes_chirho (redacted)
    - ip_address_chirho
    - user_agent_chirho
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

---

## 13. Best Practices

### 13.1 Legal Pages (Required)

| Route | Content |
|-------|---------|
| `/privacy-fe` | Privacy Policy (GDPR/CCPA compliant) |
| `/terms-fe` | Terms of Service |
| `/contact-fe` | Contact form |
| `/accessibility-fe` | WCAG 2.1 AA statement |
| `/cookie-policy-fe` | Cookie consent |
| `/refund-policy-fe` | Refund terms |

### 13.2 GDPR Compliance

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

### 13.3 Stripe Webhooks (CRITICAL)

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

### 13.4 API Key Management

```yaml
api_key_format_chirho:
  prefix:
    live: "sk_live_"
    test: "sk_test_"
    public: "pk_live_"

  storage:
    - Hash with SHA-256 (4x sequential)
    - Never store plaintext
    - Show only last 4 characters to user
```

### 13.5 Security Headers

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

### 13.6 Performance Targets

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

### 13.7 Accessibility (WCAG 2.1 AA)

```yaml
accessibility_chirho:
  required:
    - All images have alt text
    - Color contrast ratio ≥4.5:1
    - Keyboard navigation works
    - Focus indicators visible
    - ARIA labels where needed
    - Skip to content link
```

### 13.8 Mobile Responsiveness

```yaml
breakpoints_chirho:
  sm: "640px"
  md: "768px"
  lg: "1024px"
  xl: "1280px"
  2xl: "1536px"
```

### 13.9 Referral System

```yaml
referral_system_chirho:
  payout_delay: "2 weeks"  # Prevent fraud/chargebacks
  tracking: "referral code in URL"
  attribution_window: "30 days"
```

---

## 14. Directory Structure

```
openorphanage.org-chirho/
├── AGENTS.md                    # This file
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
│   │   │   └── ...
│   │   │
│   │   ├── server/
│   │   │   ├── db_chirho.ts
│   │   │   ├── schema_chirho.ts
│   │   │   ├── auth_chirho.ts
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
│       ├── feedback-chirho/
│       ├── orphanages-chirho/
│       ├── dashboard-chirho/
│       ├── admin-chirho/
│       └── api-chirho/
│
├── tests-e2e-chirho/
│   ├── homepage.e2e.ts
│   └── auth.e2e.ts
│
└── static/
    ├── favicon.svg
    └── *.jpg  # Prefer JPG for photos
```

---

## 15. Quick Commands

```bash
# Development
bun install                      # Install dependencies
bun run dev                      # Start dev server (port 5183)
bun run check                    # Type checking

# Testing
bun run test-chirho              # Unit tests
bun run test-e2e-chirho          # E2E tests (headless)

# Database
bun run db:generate-chirho       # Generate migrations
bun run db:migrate-chirho        # Run migrations (remote)
bun run db:studio-chirho         # Drizzle Studio

# Deploy
bun run deploy-chirho            # test → build → wrangler deploy

# Secrets
wrangler secret put SECRET_NAME_CHIRHO
wrangler secret list
```

---

## 16. Git & Authorship Protocol

### 16.1 Commit Message Format

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

### 16.2 Branch Conventions

```yaml
branches_chirho:
  main: main_chirho
  remote: github_chirho
  deploy: deploy_chirho  # CI runs tests here
```

---

## 17. New Project Checklist

```yaml
new_project_checklist_chirho:
  setup:
    - [ ] Create AGENTS.md
    - [ ] Create spec_chirho/ directory
    - [ ] Initialize git with main_chirho branch
    - [ ] Configure wrangler.toml with [assets] section

  cloudflare:
    - [ ] Create D1 database
    - [ ] Create KV namespace
    - [ ] Create R2 bucket (if needed)
    - [ ] Set secrets via wrangler secret put

  required_pages:
    - [ ] /privacy-fe
    - [ ] /terms-fe
    - [ ] /contact-fe

  required_components:
    - [ ] FeedbackBubbleChirho.svelte
    - [ ] Footer with fe | loveJesus | ☧ links

  testing:
    - [ ] vitest.config.ts
    - [ ] playwright.config.ts
    - [ ] At least one test for critical path
```

---

## 18. Scripture Foundation

> *"Defend the weak and the fatherless; uphold the cause of the poor and the oppressed."* — Psalm 82:3

> *"Learn to do right; seek justice. Defend the oppressed. Take up the cause of the fatherless."* — Isaiah 1:17

> *"He defends the cause of the fatherless and the widow."* — Deuteronomy 10:18

> *"A father to the fatherless, a defender of widows, is God in his holy dwelling."* — Psalm 68:5

> *"I will not leave you as orphans; I will come to you."* — John 14:18 (Jesus speaking)

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
| Branch | main_chirho |
| Remote | github_chirho |

---

**In Jesus' Name, we build technology that serves the least of these, walking with them from vulnerability to flourishing.**

---

**JESUS CHRIST IS LORD**
