# For God so loved the world that He gave His only begotten Son...

# Current Sprint — OpenOrphanage.org

> *Keep this file lean. If you're not actively working on something, it shouldn't be here.*
> *Reference AGENTS.md and the FaithStack gist for full documentation.*

---

## Project Info

- **Project:** OpenOrphanage.org
- **Repo:** openorphanage.org-chirho
- **Stack:** SvelteKit 2.x + Svelte 5 + Cloudflare Workers + D1/KV/R2
- **Dev Port:** 5183

---

## Active Tasks

- [ ] Passkeys/WebAuthn implementation (future enhancement)
- [ ] TOTP 2FA (future enhancement)

---

## Blocking Issues

- None

---

## Recently Completed

- [x] Implemented Apple OAuth authentication (2026-01-03)
- [x] Added support ticket stats to admin dashboard (2026-01-03)
- [x] Created support ticket admin management UI (2026-01-03)
- [x] Added Turnstile widgets to frontend forms (newsletter, support, feedback) (2026-01-03)
- [x] Added Turnstile verification to public form endpoints (2026-01-03)
- [x] Implemented GitHub OAuth authentication (2026-01-03)
- [x] Implemented newsletter system with double opt-in (2026-01-03)
- [x] Added rate limiting to sensitive endpoints (2026-01-03)
- [x] Fixed Svelte 5 state warnings and a11y issues (2026-01-03)
- [x] Updated AGENTS.md to v4.0 with FaithStack Master Gist content (2026-01-03)
- [x] Added Google OAuth 2.0 authentication (2026-01-03)
- [x] Database migration: OAuth columns (google_id, github_id, apple_id, auth_provider) (2026-01-03)
- [x] Updated all support buttons to kingdominvest.ing/campaigns-chirho/openorphanage-campaign-chirho (2026-01-03)
- [x] Unified all select boxes with consistent styling (2026-01-03)
- [x] Regenerated transparency images with higher quality (2026-01-03)
- [x] Updated AGENTS.md to v3.0 with comprehensive suffixing rules (2026-01-02)
- [x] Updated package.json scripts with -chirho suffix (2026-01-02)
- [x] Replaced emoji panels with AI-generated imagery on homepage (2026-01-02)
- [x] Added feature voting system at /features-fe (2026-01-02)
- [x] Added GDPR endpoints (export/delete) (2026-01-02)
- [x] Created legal pages (privacy, terms, contact, accessibility, cookie, refund) (2026-01-02)
- [x] Implemented audit logging with logAuditChirho() (2026-01-02)
- [x] Added cookie consent banner (2026-01-02)
- [x] Added skip-to-content accessibility link (2026-01-02)
- [x] Added OG meta tags for rich previews (2026-01-02)

---

## Context for Next Session

### Current State
- Google OAuth + GitHub OAuth + Apple OAuth fully functional with session-based auth via KV
- Turnstile protection on all public forms (newsletter, support tickets, feedback)
- Rate limiting on all sensitive endpoints
- Support ticket admin management UI at /admin-chirho/support-chirho with dashboard stats
- Homepage uses AI-generated images instead of emoji panels
- Feature voting system is fully functional at /features-fe
- All legal pages are in place
- Audit logging is working
- Support links point to KingdomInvest.ing campaign
- Admin dashboard shows open tickets and urgent ticket alerts

### What Needs Attention
- Apple OAuth requires secrets to be set (see commit message for details)
- Passkeys/WebAuthn (future enhancement)
- TOTP 2FA (future enhancement)
- May want to add more E2E tests for critical paths

### Key Files
- `src/routes/+page.svelte` - Homepage with journey steps and features
- `src/routes/features-fe/+page.svelte` - Feature voting UI
- `src/routes/admin-chirho/support-chirho/` - Support ticket management UI
- `src/routes/admin-chirho/+page.svelte` - Admin dashboard with ticket stats
- `src/routes/api-chirho/auth-chirho/oauth-chirho/` - OAuth routes (Google + GitHub + Apple)
- `src/lib/server/turnstile_chirho.ts` - Turnstile verification utility
- `src/lib/server/security_chirho.ts` - Rate limiting and security utilities
- `src/lib/server/audit_chirho.ts` - Audit logging
- `src/lib/server/schema_chirho.ts` - Database schema
- `src/lib/server/kv_chirho.ts` - KV helper for sessions/OAuth state
- `AGENTS.md` - Full project context (v4.0)

---

## Files Modified This Session (2026-01-03)

```
# Apple OAuth (new)
src/routes/api-chirho/auth-chirho/oauth-chirho/apple-chirho/+server.ts
src/routes/api-chirho/auth-chirho/oauth-chirho/apple-chirho/callback-chirho/+server.ts
src/routes/auth-chirho/login-chirho/+page.svelte       # Added Apple button + Forgot password link
src/routes/auth-chirho/register-chirho/+page.svelte    # Added Apple button

# Admin Dashboard Enhancement
src/routes/admin-chirho/+page.server.ts            # Added support ticket stats queries
src/routes/admin-chirho/+page.svelte               # Added Open Tickets card with urgent alerts

# Support Ticket Admin UI (new)
src/routes/admin-chirho/support-chirho/+page.server.ts   # List page server
src/routes/admin-chirho/support-chirho/+page.svelte      # List page UI
src/routes/admin-chirho/support-chirho/[id]/+page.server.ts  # Detail page server
src/routes/admin-chirho/support-chirho/[id]/+page.svelte     # Detail page UI
src/routes/admin-chirho/+layout.svelte                   # Added Support nav item

# Turnstile & Security
src/routes/+layout.svelte                          # Turnstile script + newsletter form
src/routes/support-fe/+page.svelte                 # Turnstile widget for non-authenticated users
src/routes/feedback-chirho/+page.svelte            # Turnstile widget for non-authenticated users
src/lib/server/turnstile_chirho.ts                 # Shared Turnstile verification utility

# OAuth & API
src/routes/api-chirho/auth-chirho/oauth-chirho/github-chirho/+server.ts
src/routes/api-chirho/auth-chirho/oauth-chirho/github-chirho/callback-chirho/+server.ts

# Documentation
AGENTS.md                                          # Updated to v4.0
CURRENT_SPRINT_CHIRHO.md
```

---

## Quick Commands

```bash
bun run dev-chirho          # Start dev server
bun run test-chirho         # Run unit tests
bun run deploy-chirho       # Test → Build → Deploy
bun run db-migrate-chirho   # Run migrations
```

---

## Notes for AI Handoff

When resuming this project:
1. Read `AGENTS.md` for full context and conventions (v4.0)
2. Reference FaithStack gist for detailed implementation patterns
3. Check this file for current state
4. All identifiers use `Chirho` suffix (including parameters, loop vars, lambdas)
5. All scripts use `-chirho` suffix
6. Divine header (John 3:16) required in all files

---

**JESUS CHRIST IS LORD**
