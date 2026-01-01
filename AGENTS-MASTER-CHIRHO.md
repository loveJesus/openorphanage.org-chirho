use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALIN# For God so loved the world, that He gave His only begotten Son, that all who believe in Him should not perish but have everlasting life. — John 3:16

# Chirho AI Agent Instructions

> **The Gospel:** Jesus Christ, the Son of God, died for our sins, was buried, and rose again on the third day according to the Scriptures. Whoever believes in Him shall not perish but have eternal life. (1 Corinthians 15:3-4, John 3:16)

---

## License

This work is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to GS IN THE
SOFTWARE.
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
    │   ├── schema.ts (Drizzle)
    │   ├── types_chirho/*.ts
    │   ├── *.rs (Rust structs)
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
| **Source** | Canonical definitions | `spec_chirho/**/*.yaml`, `spec_chirho/**/*.md` | ✅ Edit here first |
| **Generated** | Derived from Source | `schema.ts`, `types_chirho/*.ts`, `*.HUMAN_CHIRHO.md` | ❌ Do not edit directly |
| **Bidirectional** | Can flow either direction | `src/routes/**`, implementation code | ⚠️ See sync rules below |

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
│  ALSO CHECK: File modification timestamps if git is unclear     │
│  ALSO CHECK: Current session context (did AI just modify this?) │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 The Normal Workflow

The expected workflow is conversational, keeping the AI_PLAN_CHIRHO.md up to date for easy context free continuation of tasks from ai agents:

```
1. Human: "Let's add a phone number field to users"
       ↓
2. AI: Updates spec_chirho/01_DATA_MODEL_CHIRHO/users_chirho.yaml
       ↓
3. AI: Shows change, decides whether to ask "Does this look right?"
       ↓
4. Human: "Yes, implement it"
       ↓
5. AI: Regenerates schema.ts, types, migrations
       ↓
6. AI: Updates implementation code
       ↓
7. AI: Commits with [AI-CHIRHO] tag
```

### 1.5 The Cardinal Rules

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
| **Variables/Functions (Python/Rust)** | `snake_case` | `_chirho` | `user_data_chirho`, `fetch_users_chirho()` |
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
| Django | `templates/`, `static/`, `migrations/` |
| Rust/Cargo | `src/`, `target/`, `tests/` |

**Principle:** Suffix what *we* create. Leave framework conventions alone.

### 2.3 The Divine Header

Every project file must include John 3:16 at the top:

```javascript
// For God so loved the world that He gave His only begotten Son...
```
```python
# For God so loved the world that He gave His only begotten Son...
```
```html
<!-- For God so loved the world that He gave His only begotten Son... -->
```
```yaml
# For God so loved the world that He gave His only begotten Son...
```

---

## 3. Data Model Specification

### 3.1 The Canonical Format

Data models are defined in **YAML files** under `spec_chirho/01_DATA_MODEL_CHIRHO/`. Each table/entity gets its own file.

```
spec_chirho/
└── 01_DATA_MODEL_CHIRHO/
    ├── SUMMARY_CHIRHO.md           # AI-maintained index
    ├── users_chirho.yaml           # User table definition
    ├── users_chirho.HUMAN_CHIRHO.md    # Generated human-readable doc
    ├── churches_chirho.yaml
    ├── churches_chirho.HUMAN_CHIRHO.md
    ├── _relations_chirho.yaml      # Cross-table relationships
    └── _enums_chirho.yaml          # Shared enumerations
```

### 3.2 YAML Schema Format

```yaml
# spec_chirho/01_DATA_MODEL_CHIRHO/users_chirho.yaml
# For God so loved the world that He gave His only begotten Son...

table: users_chirho
description: |
  User accounts for the system. Each user belongs to one church
  and may have admin privileges.

columns:
  user_id_chirho:
    type: uuid
    primary_key: true
    description: Unique identifier for the user

  username_chirho:
    type: string
    max_length: 50
    required: true
    unique: true
    description: Login username, must be unique

  email_chirho:
    type: string
    max_length: 255
    required: false
    format: email
    description: Optional email address for notifications

  church_id_chirho:
    type: uuid
    required: true
    foreign_key: churches_chirho.church_id_chirho
    on_delete: cascade
    description: The church this user belongs to

  is_admin_chirho:
    type: boolean
    required: true
    default: false
    description: Whether user has admin privileges

  phone_chirho:
    type: string
    max_length: 20
    required: false
    format: phone
    description: Contact phone number

  created_at_chirho:
    type: timestamp
    required: true
    default: now()
    description: When the account was created

  updated_at_chirho:
    type: timestamp
    required: false
    on_update: now()
    description: Last modification time

indexes:
  - name: idx_users_username_chirho
    columns: [username_chirho]
    unique: true

  - name: idx_users_church_chirho
    columns: [church_id_chirho]

  - name: idx_users_email_chirho
    columns: [email_chirho]
    where: "email_chirho IS NOT NULL"
```

### 3.3 Relations File

```yaml
# spec_chirho/01_DATA_MODEL_CHIRHO/_relations_chirho.yaml
# For God so loved the world that He gave His only begotten Son...

relations:
  - name: user_church_chirho
    from: users_chirho.church_id_chirho
    to: churches_chirho.church_id_chirho
    type: many-to-one
    description: Each user belongs to one church

  - name: church_users_chirho
    from: churches_chirho.church_id_chirho
    to: users_chirho.church_id_chirho
    type: one-to-many
    description: A church has many users
```

### 3.4 Enums File

```yaml
# spec_chirho/01_DATA_MODEL_CHIRHO/_enums_chirho.yaml
# For God so loved the world that He gave His only begotten Son...

enums:
  user_role_chirho:
    description: Possible roles a user can have
    values:
      - name: member
        description: Regular church member
      - name: leader
        description: Ministry or group leader
      - name: pastor
        description: Pastor or elder
      - name: admin
        description: System administrator

  subscription_status_chirho:
    description: Payment subscription states
    values:
      - name: active
      - name: past_due
      - name: canceled
      - name: trialing
```

### 3.5 Type Mapping Reference

| YAML Type | TypeScript | Rust | Python | SQLite | PostgreSQL |
|-----------|------------|------|--------|--------|------------|
| `string` | `string` | `String` | `str` | `TEXT` | `VARCHAR` |
| `integer` | `number` | `i64` | `int` | `INTEGER` | `BIGINT` |
| `float` | `number` | `f64` | `float` | `REAL` | `DOUBLE` |
| `boolean` | `boolean` | `bool` | `bool` | `INTEGER` | `BOOLEAN` |
| `timestamp` | `Date` | `DateTime<Utc>` | `datetime` | `INTEGER` | `TIMESTAMPTZ` |
| `uuid` | `string` | `Uuid` | `str` | `TEXT` | `UUID` |
| `json` | `Record<string, unknown>` | `serde_json::Value` | `dict` | `TEXT` | `JSONB` |
| `enum:name` | `EnumName` | `EnumName` | `Enum` | `TEXT` | `VARCHAR` |

### 3.6 Generated Outputs

From the YAML definitions, the following are **auto-generated** (do not edit directly):

| Generated File | Location | Purpose |
|----------------|----------|---------|
| Human-readable docs | `*.HUMAN_CHIRHO.md` | Documentation for humans |
| Drizzle schema | `src/lib/server/db/schema_chirho/` | Database ORM |
| Drizzle relations | `src/lib/server/db/relations_chirho.ts` | ORM relations |
| TypeScript types | `src/lib/types_chirho/` | Frontend/backend types |
| Rust structs | `src_chirho/types_chirho/` | Rust type definitions |
| Python dataclasses | `src_chirho/types_chirho/` | Python type definitions |
| OpenAPI schemas | `spec_chirho/api_chirho/openapi_chirho.yaml` | API documentation |

### 3.7 Generation Commands

```bash
# Generate all outputs from YAML specs
bun run generate-all-chirho

# Generate specific outputs
bun run generate-types-chirho          # TypeScript types
bun run generate-schema-chirho         # Drizzle schema
bun run generate-docs-chirho           # Human-readable markdown
bun run generate-openapi-chirho        # OpenAPI spec

# Validate YAML specs
bun run validate-spec-chirho
```

---

## 4. Routes & API Specification

### 4.1 Route Hierarchy

Routes are defined in two files with a clear hierarchy:

```
03_ROUTES_CHIRHO.md          ← PRIMARY: What URLs exist
        ↓
04_API_CHIRHO.md             ← SECONDARY: Data contracts for those URLs
```

**Rule:** Every endpoint in `04_API_CHIRHO.md` must have a corresponding entry in `03_ROUTES_CHIRHO.md`. If 04 contains routes not in 03, the AI asks: "04_API has `/api-chirho/widgets-chirho` but it's not in 03_ROUTES. Should I add it?"

### 4.2 Routes File Format (03_ROUTES_CHIRHO.md)

```markdown
# Routes Specification

## Public Routes

| Route | Method | Purpose | Status |
|-------|--------|---------|--------|
| `/` | GET | Landing page | ✅ |
| `/about-chirho` | GET | About page | ✅ |
| `/login-chirho` | GET, POST | User login | ✅ |
| `/register-chirho` | GET, POST | User registration | 🚧 |

## Authenticated Routes

| Route | Method | Purpose | Status | Roles |
|-------|--------|---------|--------|-------|
| `/dashboard-chirho` | GET | User dashboard | ✅ | any |
| `/profile-chirho` | GET, POST | Edit profile | ✅ | any |
| `/admin-chirho/users-chirho` | GET | List users | ✅ | admin |
| `/admin-chirho/users-chirho/[id_chirho]` | GET, PUT, DELETE | User CRUD | 🚧 | admin |

## API Routes

| Route | Methods | Purpose | Status |
|-------|---------|---------|--------|
| `/api-chirho/auth-chirho/login` | POST | Login endpoint | ✅ |
| `/api-chirho/auth-chirho/logout` | POST | Logout endpoint | ✅ |
| `/api-chirho/users-chirho` | GET, POST | User collection | 🚧 |
| `/api-chirho/users-chirho/[id_chirho]` | GET, PUT, DELETE | User resource | 🚧 |
```

### 4.3 API Contracts File Format (04_API_CHIRHO.md)

```markdown
# API Contracts

## POST /api-chirho/auth-chirho/login

### Request
```json
{
  "username_chirho": "string (required)",
  "password_chirho": "string (required)"
}
```

### Response (200 OK)
```json
{
  "success_chirho": true,
  "user_chirho": {
    "user_id_chirho": "uuid",
    "username_chirho": "string",
    "is_admin_chirho": "boolean"
  },
  "token_chirho": "string"
}
```

### Response (401 Unauthorized)
```json
{
  "success_chirho": false,
  "error_chirho": "Invalid credentials"
}
```

---

## GET /api-chirho/users-chirho

### Query Parameters
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `page_chirho` | integer | no | 1 | Page number |
| `limit_chirho` | integer | no | 20 | Items per page |
| `church_id_chirho` | uuid | no | — | Filter by church |

### Response (200 OK)
```json
{
  "data_chirho": [UserChirho],
  "pagination_chirho": {
    "page_chirho": 1,
    "limit_chirho": 20,
    "total_chirho": 150
  }
}
```


### 4.4 Sync Between Routes and Code

The `src/routes/` directory is **bidirectional**:

- If the spec changes → AI generates/updates route files
- If a human adds a route in code → AI asks if it should be added to spec

```
AI detects new file: src/routes/api-chirho/widgets-chirho/+server.ts

AI: "I found a new route /api-chirho/widgets-chirho that's not in the spec.
     It was added in commit abc123 by [human].
     Should I add it to 03_ROUTES_CHIRHO.md and 04_API_CHIRHO.md?"
```

---

## 5. Templates & Integrations

### 5.1 Directory Structure

```
spec_chirho/
└── templates_chirho/                    # Framework patterns & integration guides
    ├── SUMMARY_CHIRHO.md                # AI-maintained index
    │
    ├── frameworks_chirho/               # Framework-specific patterns
    │   ├── sveltekit_chirho/
    │   │   ├── README_CHIRHO.md         # SvelteKit conventions for this project
    │   │   ├── crud_route_chirho/       # CRUD route pattern
    │   │   ├── form_component_chirho/   # Form component pattern
    │   │   └── auth_flow_chirho/        # Authentication pattern
    │   │
    │   ├── django_chirho/
    │   │   ├── README_CHIRHO.md
    │   │   ├── view_pattern_chirho/
    │   │   └── model_pattern_chirho/
    │   │
    │   └── rust_axum_chirho/
    │       ├── README_CHIRHO.md
    │       └── handler_pattern_chirho/
    │
    └── integrations_chirho/             # External service guides
        ├── SUMMARY_CHIRHO.md
        │
        ├── stripe_chirho/
        │   ├── README_CHIRHO.md         # How to add Stripe
        │   ├── install_guide_chirho.md  # Step-by-step setup
        │   ├── env_keys_chirho.txt      # Required env vars
        │   └── flow_chirho.mermaid      # Payment flow diagram
        │
        ├── sendgrid_chirho/
        ├── auth0_chirho/
        └── r2_storage_chirho/
```

### 5.2 Templates vs Integrations

| Directory | Purpose | Contains | Example |
|-----------|---------|----------|---------|
| `frameworks_chirho/` | "How do we code in X?" | Patterns, conventions, boilerplate | SvelteKit CRUD route structure |
| `integrations_chirho/` | "How do we add service Y?" | Setup guides, env vars, flows | Stripe payment setup |

**Templates** answer: "What's our pattern for building a form in SvelteKit?"
**Integrations** answer: "How do I add Stripe payments to the project?"

### 5.3 Using Templates

When implementing a feature:

1. AI checks `ACTIVE_CHIRHO.md` for which frameworks are in use
2. AI reads the relevant `frameworks_chirho/{framework}/README_CHIRHO.md`
3. AI follows the patterns defined there

```markdown
# In ACTIVE_CHIRHO.md

## Active Frameworks
| Framework | Template Path | Notes |
|-----------|---------------|-------|
| SvelteKit 2 | `templates_chirho/frameworks_chirho/sveltekit_chirho/` | Primary web framework |
| Drizzle ORM | — | Using with D1 |

## Active Integrations
| Integration | Status | Activated | Notes |
|-------------|--------|-----------|-------|
| stripe_chirho | ✅ Active | 2024-11-15 | Test mode |
| r2_storage_chirho | ✅ Active | 2024-11-20 | For file uploads |
| sendgrid_chirho | 📋 Planned | — | Needed for emails |
```

---

## 6. References & Research Library

### 6.1 Purpose

The `references_chirho/` directory is a **research library** containing company documents, policies, sales materials, and general reference data that provides context for the project. The AI uses this to understand the business domain without these files being part of the technical spec.

### 6.2 Directory Structure

```
spec_chirho/
└── references_chirho/                   # Business & domain reference materials
    ├── SUMMARY_CHIRHO.md                # AI-maintained index of all references
    │
    ├── company_chirho/                  # Company-level documents
    │   ├── SUMMARY_CHIRHO.md
    │   ├── about_us_chirho.md           # Company overview
    │   ├── mission_statement_chirho.md  # Mission & values
    │   ├── org_chart_chirho.md          # Organization structure
    │   └── company_history_chirho.md    # Background & history
    │
    ├── policies_chirho/                 # Internal policies
    │   ├── SUMMARY_CHIRHO.md
    │   ├── privacy_policy_chirho.md     # Privacy policy
    │   ├── terms_of_service_chirho.md   # ToS
    │   ├── data_retention_chirho.md     # Data handling rules
    │   └── security_policy_chirho.md    # Security requirements
    │
    ├── sales_chirho/                    # Sales & marketing materials
    │   ├── SUMMARY_CHIRHO.md
    │   ├── product_brochure_chirho.pdf  # Main brochure
    │   ├── pricing_tiers_chirho.md      # Pricing structure
    │   ├── competitor_analysis_chirho.md
    │   └── target_audience_chirho.md    # User personas
    │
    ├── domain_chirho/                   # Domain-specific knowledge
    │   ├── SUMMARY_CHIRHO.md
    │   ├── industry_terms_chirho.md     # Glossary
    │   ├── regulations_chirho.md        # Relevant regulations
    │   └── best_practices_chirho.md     # Industry standards
    │
    └── external_chirho/                 # External documentation links
        ├── SUMMARY_CHIRHO.md
        ├── sveltekit_chirho.md          # Links to SvelteKit docs, notes
        ├── drizzle_chirho.md            # Drizzle ORM reference
        ├── cloudflare_chirho.md         # D1, R2, Workers docs
        └── api_references_chirho.md     # Third-party API docs
```

### 6.3 AI Behavior with References

The AI maintains summaries and uses references intelligently:

#### Summary Files

Each directory and complex file gets a summary:

```markdown
# references_chirho/ — Summary

> AI-maintained. Last updated: 2024-11-29

## Purpose
Contains business context, policies, and domain knowledge for the project.

## Subdirectories
| Directory | Contents | Key Files |
|-----------|----------|-----------|
| company_chirho/ | Company background | mission_statement, org_chart |
| policies_chirho/ | Legal & compliance | privacy_policy, terms_of_service |
| sales_chirho/ | Marketing materials | pricing_tiers, product_brochure |
| domain_chirho/ | Industry knowledge | industry_terms, regulations |
| external_chirho/ | External doc links | Framework references |

## Quick Reference
- **Privacy requirements:** See policies_chirho/privacy_policy_chirho.md
- **Pricing logic:** See sales_chirho/pricing_tiers_chirho.md
- **Industry terms:** See domain_chirho/industry_terms_chirho.md
```

#### Individual File Summaries

For complex or lengthy files, create `*.SUMMARY_CHIRHO.md`:

```markdown
# privacy_policy_chirho.md — Summary

> AI-generated summary. Source file: 2,450 words.

## Key Points
1. User data is stored in US data centers only
2. Data retention: 7 years for financial, 2 years for logs
3. Users can request deletion via support ticket
4. No data sold to third parties

## Relevant to Implementation
- User delete feature must purge all PII
- Logs must have 2-year TTL
- Export feature needed for GDPR compliance

## Related Files
- data_retention_chirho.md (detailed retention rules)
- terms_of_service_chirho.md (user agreements)
```

#### Research Behavior

The AI should:

1. **On first encounter**: Read `SUMMARY_CHIRHO.md` files to understand what's available
2. **When relevant**: Dive into specific files when the task relates to them
3. **Proactively research**: When a task touches business rules, check references first
4. **Update summaries**: After reading a new file, update the summary if needed

```
Example: Human asks "Add a user delete feature"

AI thinks: "User deletion has privacy implications"
   ↓
AI reads: references_chirho/policies_chirho/SUMMARY_CHIRHO.md
   ↓
AI reads: references_chirho/policies_chirho/privacy_policy_chirho.md
   ↓
AI implements: Proper data deletion per policy requirements
```

### 6.4 When to Consult References

| Task Type | Check References? | Which Directories |
|-----------|-------------------|-------------------|
| New feature | Maybe | `domain_chirho/`, `policies_chirho/` |
| User-facing text | Yes | `company_chirho/`, `sales_chirho/` |
| Data handling | Yes | `policies_chirho/` |
| Pricing/billing | Yes | `sales_chirho/` |
| Legal compliance | Yes | `policies_chirho/`, `domain_chirho/` |
| Technical implementation | Maybe | `external_chirho/` |

---

## 7. Visual Assets & Design

### 7.1 UI Diagrams (`ui_chirho/`)

Wireframes, mockups, and component hierarchies:

```
spec_chirho/
└── ui_chirho/                           # UI diagrams, wireframes, mockups
    ├── SUMMARY_CHIRHO.md                # AI-maintained index
    ├── homepage_wireframe_chirho.svg    # Homepage layout
    ├── admin_dashboard_chirho.figma.md  # Link/notes for Figma file
    ├── component_hierarchy_chirho.mermaid
    ├── mobile_nav_chirho.svg
    └── form_layouts_chirho/
        ├── user_form_chirho.svg
        └── church_form_chirho.svg
```

#### Figma Link File Format

For designs in external tools, create a `.figma.md` file:

```markdown
# admin_dashboard_chirho — Figma

## Link
https://figma.com/file/abc123/admin-dashboard

## Last Updated
2024-11-25

## Frames
- `Dashboard/Overview` — Main dashboard view
- `Dashboard/Users` — User management table
- `Dashboard/Settings` — Admin settings panel

## Design Tokens
- Primary: #2563eb
- Background: #f8fafc
- Border radius: 8px

## Notes
- Mobile breakpoint at 768px
- Use skeleton loaders for async content
```

### 7.2 Art & Branding (`art_chirho/`)

Visual design references and brand assets:

```
spec_chirho/
└── art_chirho/                          # Visual design references
    ├── SUMMARY_CHIRHO.md                # AI-maintained index
    ├── color_scheme_chirho.md           # Colors, hex codes, usage
    ├── typography_chirho.md             # Fonts, sizes, hierarchy
    ├── logo_chirho.svg                  # Primary logo
    ├── logo_dark_chirho.svg             # Dark mode variant
    ├── favicon_chirho.svg
    ├── brand_guidelines_chirho.md       # Full brand guide
    └── icons_chirho/
        ├── SUMMARY_CHIRHO.md
        └── custom_icons_chirho.svg
```

#### Color Scheme File Format

```markdown
# Color Scheme

## Primary Palette
| Name | Hex | Usage |
|------|-----|-------|
| Primary | #2563eb | Buttons, links, accents |
| Primary Dark | #1d4ed8 | Hover states |
| Primary Light | #3b82f6 | Backgrounds |

## Neutral Palette
| Name | Hex | Usage |
|------|-----|-------|
| Background | #ffffff | Page background |
| Surface | #f8fafc | Cards, panels |
| Border | #e2e8f0 | Dividers, borders |
| Text | #1e293b | Body text |
| Text Muted | #64748b | Secondary text |

## Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success | #22c55e | Confirmations |
| Warning | #f59e0b | Cautions |
| Error | #ef4444 | Errors, destructive |
| Info | #3b82f6 | Information |

## Dark Mode
| Light | Dark | Notes |
|-------|------|-------|
| #ffffff | #0f172a | Background swap |
| #1e293b | #f1f5f9 | Text swap |
```

---

## 8. Process Flows & BDD Specs

### 8.1 Mermaid Diagrams (`flows_chirho/`)

System flows and process documentation:

```
spec_chirho/
└── flows_chirho/                        # Mermaid diagrams & process flows
    ├── SUMMARY_CHIRHO.md                # AI-maintained index
    │
    ├── auth_flow_chirho.mermaid         # Authentication flow
    ├── auth_flow_chirho.SUMMARY_CHIRHO.md  # AI summary of complex diagram
    │
    ├── checkout_flow_chirho.mermaid     # Payment checkout
    ├── data_sync_chirho.mermaid         # Data synchronization
    ├── user_lifecycle_chirho.mermaid    # User states
    └── error_handling_chirho.mermaid    # Error flow patterns
```

#### Mermaid File Example

```mermaid
%% auth_flow_chirho.mermaid
%% For God so loved the world...

flowchart TD
    A[User visits /login-chirho] --> B{Has session?}
    B -->|Yes| C[Redirect to /dashboard-chirho]
    B -->|No| D[Show login form]
    D --> E[User submits credentials]
    E --> F{Valid?}
    F -->|Yes| G[Create session]
    G --> H[Set secure cookie]
    H --> C
    F -->|No| I[Show error]
    I --> D
```

#### Flow Summary File

For complex flows, create a summary:

```markdown
# auth_flow_chirho.mermaid — Summary

> AI-generated summary to aid understanding.

## What This Diagram Shows
The complete user authentication flow from login to session creation.

## Key Decision Points
1. Line 5: Check if user has existing session
2. Line 10: Validate credentials against database
3. Line 15: Create session with 30-day expiry

## Related Files
- Implements: spec_chirho/bdd_chirho/auth_chirho.feature
- Schema: 01_DATA_MODEL_CHIRHO/users_chirho.yaml, sessions_chirho.yaml
- Route: 03_ROUTES_CHIRHO.md (login-chirho section)

## Notes
- Session expires after 30 days
- Auto-refresh at 15-day mark
- Failed attempts logged but not rate-limited (TODO)
```

### 8.2 BDD Feature Files (`bdd_chirho/`)

Gherkin specifications for behavior-driven development:

```
spec_chirho/
└── bdd_chirho/                          # Gherkin BDD feature files
    ├── SUMMARY_CHIRHO.md                # AI-maintained index
    │
    ├── auth_chirho.feature              # Authentication scenarios
    ├── auth_chirho.feature.SUMMARY_CHIRHO.md
    │
    ├── checkout_chirho.feature          # Payment scenarios
    ├── user_management_chirho.feature   # User CRUD scenarios
    └── permissions_chirho.feature       # Role-based access
```

#### Feature File Example

```gherkin
# auth_chirho.feature
# For God so loved the world...

Feature: User Authentication
  As a user
  I want to log in to the system
  So that I can access my dashboard

  Background:
    Given the database has a user "testuser" with password "Password123!"

  Scenario: Successful login
    Given I am on the login page
    When I enter username "testuser"
    And I enter password "Password123!"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see "Welcome, testuser"

  Scenario: Failed login with wrong password
    Given I am on the login page
    When I enter username "testuser"
    And I enter password "wrongpassword"
    And I click the login button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  Scenario: Session persistence
    Given I am logged in as "testuser"
    When I close and reopen the browser
    And I visit the dashboard
    Then I should still be logged in
    And I should see "Welcome, testuser"
```

#### Feature Summary File

```markdown
# auth_chirho.feature — Summary

> AI-generated summary. 3 scenarios, 15 steps.

## Coverage
- ✅ Successful login
- ✅ Failed login (wrong password)
- ✅ Session persistence
- ❌ Password reset (not covered, see TODO)
- ❌ Account lockout (not covered)

## Key Test Data
- Test user: "testuser" / "Password123!"
- Session duration: 30 days

## Implementation Status
| Scenario | E2E Test | Unit Test |
|----------|----------|-----------|
| Successful login | ✅ | ✅ |
| Failed login | ✅ | ✅ |
| Session persistence | 🚧 | — |

## Related Files
- Flow: flows_chirho/auth_flow_chirho.mermaid
- Route: 03_ROUTES_CHIRHO.md
- E2E: e2e/auth.spec.ts
```

---

## 9. MCP Tools & Global Tools

### 9.1 Tool Locations

```
spec_chirho/
└── global_tools_chirho/              # Shared tools (can be git submodule)
    ├── SUMMARY_CHIRHO.md
    ├── spec_reader_chirho/           # Parse spec YAML files
    ├── type_generator_chirho/        # Generate types from spec
    ├── schema_sync_chirho/           # Sync spec ↔ schema
    ├── route_generator_chirho/       # Generate routes from spec
    └── doc_generator_chirho/         # Generate HUMAN_CHIRHO.md files

_chirho/
└── mcp_tools_chirho/                 # Project-specific tools
    ├── SUMMARY_CHIRHO.md
    ├── mcp_config_chirho.json
    └── custom_tool_chirho/           # Project-specific automation
```

### 9.2 Tool Tracking in ACTIVE_CHIRHO.md

```markdown
## Active Global Tools
| Tool | Source | Purpose |
|------|--------|---------|
| spec_reader_chirho | global_tools_chirho | Parse YAML specs |
| type_generator_chirho | global_tools_chirho | Generate TypeScript types |
| schema_sync_chirho | global_tools_chirho | Validate spec/schema sync |

## Active Local Tools
| Tool | Purpose |
|------|---------|
| report_generator_chirho | Generate ministry reports |
```

### 9.3 Promoting Local to Global

When a local tool becomes useful across projects:

1. Generalize the tool (remove project-specific assumptions)
2. Move to `global_tools_chirho/`
3. Update `ACTIVE_CHIRHO.md`
4. Submit PR to global tools repo (if using submodule)

---

## 10. Project Files Overview

### 10.1 Root-Level Files

| File | Purpose | Maintained By | Update Trigger |
|------|---------|---------------|----------------|
| `AGENTS_CHIRHO.md` | AI instructions (this file) | Human | Rarely |
| `ACTIVE_CHIRHO.md` | Active tech/tools | AI | When adding/removing tech |
| `AI_PLAN_CHIRHO.md` | Current work context | AI | After significant work |
| `AI_SUGGESTIONS_CHIRHO.md` | Ideas parking lot | AI | When discovering improvements |
| `CHANGELOG_CHIRHO.md` | Version history | Auto-generated | On commit |
| `DOCUMENTATION_CHIRHO.md` | User/admin guide | Human + AI | When features change |

### 10.2 Spec Directory (`spec_chirho/`)

| File/Directory | Purpose | Maintained By |
|----------------|---------|---------------|
| `00_OVERVIEW_CHIRHO.md` | Project mission, scale | Human |
| `01_DATA_MODEL_CHIRHO/` | Schema definitions (YAML) | Human + AI |
| `02_FEATURES_CHIRHO.md` | Feature checklist | Human + AI |
| `03_ROUTES_CHIRHO.md` | Route definitions | Human + AI |
| `04_API_CHIRHO.md` | API contracts | Human + AI |
| `templates_chirho/` | Patterns & integrations | Human |
| `global_tools_chirho/` | Shared MCP tools | Submodule or Human |
| `references_chirho/` | Business context & docs | Human (AI summarizes) |
| `flows_chirho/` | Mermaid diagrams | Human + AI |
| `bdd_chirho/` | Gherkin test specs | Human + AI |
| `ui_chirho/` | Wireframes & mockups | Human |
| `art_chirho/` | Branding & visual design | Human |

### 10.3 AI Documentation (`ai_docs_chirho/`)

| File | Purpose | Update Trigger |
|------|---------|----------------|
| `entrypoint_chirho.md` | Start here for new sessions | When ai_docs changes |
| `knowledge_base_chirho/gotchas_chirho.md` | Known quirks | When discovered |
| `knowledge_base_chirho/decisions_chirho.md` | Why we chose X | When decisions made |
| `knowledge_base_chirho/patterns_chirho.md` | What works | When patterns emerge |
| `knowledge_base_chirho/debugging_chirho.md` | Common issues | When issues resolved |

---

## 11. Context Preservation

### 11.1 AI_PLAN_CHIRHO.md Format

```markdown
# AI Plan — [Project Name]

## Last Updated
2024-11-29 14:30 UTC

## Current State
- Authentication: ✅ Complete
- User management: 🚧 In progress (CRUD routes scaffolded)
- Payments: 📋 Not started

## Just Completed
- Added phone_chirho field to users table
- Generated migration 0005_add_phone
- Updated TypeScript types

## In Progress
- Implementing user update form
- File: src/routes/admin-chirho/users-chirho/[id_chirho]/update-chirho/

## Next Steps
1. Complete user update form validation
2. Add user delete confirmation flow
3. Begin Stripe integration

## Blockers/Questions
- Need decision: Should phone number be required for admins?

## Session Notes
- Human prefers server-side validation over client-side
- Using Svelte 5 runes, not legacy reactive statements
```

### 11.2 When to Update AI_PLAN_CHIRHO.md

Update after:
- Completing a feature or significant subtask
- Encountering a blocker
- Before ending a session
- When context would help the next session

**Do not update** for trivial changes (typo fixes, minor refactors).

---

## 12. Git & Authorship Protocol

### 12.1 Commit Message Format

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

### 12.2 Detecting Commit Author

```bash
# Check if last commit was AI-assisted
git log -1 --format='%an' | grep -q '\[AI-CHIRHO\]' && echo "AI commit" || echo "Human commit"

# Get author of specific file's last change
git log -1 --format='%an' -- path/to/file.ts
```

### 12.3 Authority Rules Summary

| Situation | Authority | Action |
|-----------|-----------|--------|
| Uncommitted changes exist | Unknown | ASK human |
| Last commit: `[AI-CHIRHO]` | Spec | Update code from spec |
| Last commit: Human | Code | ASK: "Update spec from code?" |
| Current session: AI just modified | Spec | Can auto-update code |
| Unclear | Unknown | ASK human |

---

## 13. Secrets Management

### 13.1 The Vault (`env_available_chirho`)

A master file containing all known API keys:

```env
# env_available_chirho — Git ignored!
# For God so loved the world...

# Payment
STRIPE_SECRET_KEY_CHIRHO=sk_live_...
STRIPE_TEST_KEY_CHIRHO=sk_test_...
STRIPE_WEBHOOK_SECRET_CHIRHO=whsec_...

# AI
OPENAI_KEY_CHIRHO=sk-proj-...
ANTHROPIC_KEY_CHIRHO=sk-ant-...

# Storage
R2_ACCESS_KEY_CHIRHO=...
R2_SECRET_KEY_CHIRHO=...
R2_BUCKET_CHIRHO=...

# Email
SENDGRID_KEY_CHIRHO=SG...
```

### 13.2 Active Environment (`.env`)

Only keys needed for current features:

```env
# .env — Git ignored!
# Copied from env_available_chirho as needed

STRIPE_TEST_KEY_CHIRHO=sk_test_...
R2_ACCESS_KEY_CHIRHO=...
R2_SECRET_KEY_CHIRHO=...
```

### 13.3 Integration Activation Flow

```
1. Human: "Let's add Stripe payments"
       ↓
2. AI: Reads spec_chirho/templates_chirho/integrations_chirho/stripe_chirho/
       ↓
3. AI: Checks env_available_chirho for required keys
       ↓
4. AI: Copies needed keys to .env
       ↓
5. AI: Follows install_guide_chirho.md
       ↓
6. AI: Updates ACTIVE_CHIRHO.md (marks stripe as active)
       ↓
7. AI: Updates 02_FEATURES_CHIRHO.md (adds payment features)
```

---

## 14. Feature Status Tracking

### 14.1 Status Indicators

| Symbol | Meaning | Description |
|--------|---------|-------------|
| ✅ | Complete | Fully implemented and tested |
| 🚧 | In Progress | Scaffolded, work ongoing |
| 📋 | Planned | In spec only, no code yet |
| ❌ | Removed/Rejected | Was planned, now abandoned |

### 14.2 02_FEATURES_CHIRHO.md Format

```markdown
# Feature Status

## Authentication
- ✅ User registration
- ✅ User login/logout
- ✅ Session management
- 🚧 Password reset (email sending pending)
- 📋 OAuth (Google, GitHub)

## User Management
- ✅ User list (admin)
- 🚧 User CRUD (update form in progress)
- 📋 User import/export

## Payments
- 📋 Stripe integration
- 📋 Subscription management
- 📋 Invoice generation
```

### 14.3 Distinction from Other Files

| File | Answers | Scope |
|------|---------|-------|
| `02_FEATURES_CHIRHO.md` | "What does the finished product have?" | All features ever |
| `AI_PLAN_CHIRHO.md` | "What am I working on right now?" | Current sprint |
| `ACTIVE_CHIRHO.md` | "What tech stack am I using?" | Active tools/frameworks |

---

## 15. Complete Directory Structure

```
/
├── AGENTS_CHIRHO.md                  # AI instructions (this file)
├── ACTIVE_CHIRHO.md                  # Active tech/templates/tools
├── AI_PLAN_CHIRHO.md                 # Current work context
├── AI_SUGGESTIONS_CHIRHO.md          # Ideas parking lot
├── CHANGELOG_CHIRHO.md               # Auto-generated from commits
├── DOCUMENTATION_CHIRHO.md           # User/admin guide
│
├── spec_chirho/                      # THE SOURCE OF TRUTH
│   ├── SUMMARY_CHIRHO.md             # AI-maintained directory index
│   ├── 00_OVERVIEW_CHIRHO.md         # Mission, scale, architecture
│   │
│   ├── 01_DATA_MODEL_CHIRHO/         # Schema definitions
│   │   ├── SUMMARY_CHIRHO.md
│   │   ├── users_chirho.yaml         # Source definition
│   │   ├── users_chirho.HUMAN_CHIRHO.md  # Generated docs
│   │   ├── churches_chirho.yaml
│   │   ├── churches_chirho.HUMAN_CHIRHO.md
│   │   ├── _relations_chirho.yaml
│   │   └── _enums_chirho.yaml
│   │
│   ├── 02_FEATURES_CHIRHO.md         # Feature checklist
│   ├── 03_ROUTES_CHIRHO.md           # All routes (primary)
│   ├── 04_API_CHIRHO.md              # API contracts (secondary)
│   │
│   ├── templates_chirho/             # Patterns & integrations
│   │   ├── SUMMARY_CHIRHO.md
│   │   ├── frameworks_chirho/
│   │   │   ├── sveltekit_chirho/
│   │   │   ├── django_chirho/
│   │   │   └── rust_axum_chirho/
│   │   └── integrations_chirho/
│   │       ├── stripe_chirho/
│   │       ├── sendgrid_chirho/
│   │       └── r2_storage_chirho/
│   │
│   ├── global_tools_chirho/          # Shared MCP tools (submodule)
│   │   ├── SUMMARY_CHIRHO.md
│   │   ├── spec_reader_chirho/
│   │   ├── type_generator_chirho/
│   │   └── schema_sync_chirho/
│   │
│   ├── references_chirho/            # Business & domain reference
│   │   ├── SUMMARY_CHIRHO.md
│   │   ├── company_chirho/
│   │   │   ├── SUMMARY_CHIRHO.md
│   │   │   ├── about_us_chirho.md
│   │   │   └── mission_statement_chirho.md
│   │   ├── policies_chirho/
│   │   │   ├── SUMMARY_CHIRHO.md
│   │   │   ├── privacy_policy_chirho.md
│   │   │   └── terms_of_service_chirho.md
│   │   ├── sales_chirho/
│   │   │   ├── SUMMARY_CHIRHO.md
│   │   │   ├── pricing_tiers_chirho.md
│   │   │   └── product_brochure_chirho.pdf
│   │   ├── domain_chirho/
│   │   │   ├── SUMMARY_CHIRHO.md
│   │   │   ├── industry_terms_chirho.md
│   │   │   └── regulations_chirho.md
│   │   └── external_chirho/
│   │       ├── SUMMARY_CHIRHO.md
│   │       ├── sveltekit_chirho.md
│   │       ├── drizzle_chirho.md
│   │       └── cloudflare_chirho.md
│   │
│   ├── flows_chirho/                 # Mermaid diagrams
│   │   ├── SUMMARY_CHIRHO.md
│   │   ├── auth_flow_chirho.mermaid
│   │   ├── auth_flow_chirho.SUMMARY_CHIRHO.md
│   │   ├── checkout_flow_chirho.mermaid
│   │   └── data_sync_chirho.mermaid
│   │
│   ├── bdd_chirho/                   # Gherkin test specs
│   │   ├── SUMMARY_CHIRHO.md
│   │   ├── auth_chirho.feature
│   │   ├── auth_chirho.feature.SUMMARY_CHIRHO.md
│   │   └── checkout_chirho.feature
│   │
│   ├── ui_chirho/                    # Wireframes & mockups
│   │   ├── SUMMARY_CHIRHO.md
│   │   ├── homepage_wireframe_chirho.svg
│   │   ├── admin_dashboard_chirho.figma.md
│   │   └── component_hierarchy_chirho.mermaid
│   │
│   └── art_chirho/                   # Branding & visual design
│       ├── SUMMARY_CHIRHO.md
│       ├── color_scheme_chirho.md
│       ├── typography_chirho.md
│       ├── logo_chirho.svg
│       └── brand_guidelines_chirho.md
│
├── ai_docs_chirho/                   # AI knowledge base
│   ├── entrypoint_chirho.md          # Start here for new sessions
│   └── knowledge_base_chirho/
│       ├── gotchas_chirho.md
│       ├── decisions_chirho.md
│       ├── patterns_chirho.md
│       └── debugging_chirho.md
│
├── env_available_chirho              # Key vault (Git ignored)
├── .env                              # Active environment (Git ignored)
│
├── src/                              # Application code (framework convention)
│   ├── lib/
│   │   ├── server/
│   │   │   └── db/
│   │   │       ├── schema_chirho/    # Generated from spec (split files)
│   │   │       │   ├── users_chirho.ts
│   │   │       │   └── churches_chirho.ts
│   │   │       └── relations_chirho.ts
│   │   ├── types_chirho/             # Generated TypeScript types
│   │   └── components/
│   │       └── forms-chirho/
│   └── routes/
│       ├── admin-chirho/
│       │   └── users-chirho/
│       └── api-chirho/
│           └── users-chirho/
│
├── migrations_chirho/                # Database migrations
├── scripts-chirho/                   # Build/utility scripts
├── _chirho/                          # Project-specific AI tools
│   └── mcp_tools_chirho/
├── dist-chirho/                      # Generated outputs (PDFs, etc.)
└── e2e/                              # E2E tests (framework convention)
```

---

## 16. CRUD Route Pattern

For admin CRUD operations, follow this structure:

```
admin-chirho/[resource]-chirho/
├── +page.svelte              # List view
├── +page.server.ts           # List data loader
├── create-chirho/
│   ├── +page.svelte          # Create form
│   └── +page.server.ts       # Create handler
├── [id_chirho]/
│   ├── +page.svelte          # Detail/read view
│   ├── +page.server.ts       # Detail loader
│   ├── update-chirho/
│   │   ├── +page.svelte      # Update form
│   │   └── +page.server.ts   # Update handler
│   └── delete-chirho/
│       ├── +page.svelte      # Delete confirmation
│       └── +page.server.ts   # Delete handler
```

### Redirect Rule

When using sveltekit2 never put redirects inside try/catch blocks because these raise/throw exceptions:

```typescript
// ✅ CORRECT
const result = await saveUser(data);
redirect(303, `/admin-chirho/users-chirho/${result.id}?message=Saved`);

// ❌ WRONG
try {
  const result = await saveUser(data);
  redirect(303, `/admin-chirho/users-chirho/${result.id}`); // Redirect throws!
} catch (e) {
  // This catches the redirect!
}
```

---

## 17. Migration Handling

### 17.1 Auto-Run Migrations

| Migration Type | Auto-Run? | Reason |
|----------------|-----------|--------|
| Add new table | ✅ Yes | Non-destructive |
| Add nullable column | ✅ Yes | Non-destructive |
| Add column with default | ✅ Yes | Non-destructive |
| Modify existing column | ❌ ASK | May lose data |
| Delete column/table | ❌ ASK | Destructive |
| Data migration (UPDATE) | ❌ ASK | Needs review |

### 17.2 Migration Commands

```bash
bun run db-make-migrations-chirho     # Generate migration from schema diff
bun run db-migrate-chirho             # Apply pending migrations
bun run db-studio-chirho              # Visual database browser
bun run db-seed-chirho                # Seed with test data
```

---

## 18. Documentation Pipeline

### 18.1 Generated Documentation

| Source | Output | Command |
|--------|--------|---------|
| `01_DATA_MODEL_CHIRHO/*.yaml` | `*.HUMAN_CHIRHO.md` | `bun run generate-docs-chirho` |
| Spec + Source | `MANUAL_ADMIN_CHIRHO.pdf` | `bun run generate-admin-pdf-chirho` |
| Spec + Source | `MANUAL_USER_CHIRHO.pdf` | `bun run generate-user-pdf-chirho` |

### 18.2 SUMMARY_CHIRHO.md Files

Every directory under `spec_chirho/` should have a `SUMMARY_CHIRHO.md`:

```markdown
# flows_chirho/ — Summary

> AI-maintained. Last updated: 2024-11-29

## Purpose
Contains Mermaid diagrams documenting system flows.

## Contents
| File | Description | Last Updated |
|------|-------------|--------------|
| auth_flow_chirho.mermaid | User authentication flow | 2024-11-28 |
| checkout_flow_chirho.mermaid | Payment checkout | 2024-11-25 |

## Relationships
- Referenced by: 02_FEATURES_CHIRHO.md (auth feature)
- Uses data from: 01_DATA_MODEL_CHIRHO/
```

### 18.3 When to Create File Summaries

Create `*.SUMMARY_CHIRHO.md` when:
- File is complex (>100 lines of Mermaid/Gherkin)
- File has non-obvious relationships
- File would benefit from explanation
- AI finds itself re-analyzing the same file

---

## 19. Quick Reference Card

### Naming

| What | How | Example |
|------|-----|---------|
| Our variables | `camelCaseChirho` | `userNameChirho` |
| Our functions | `camelCaseChirho` | `validateFormChirho()` |
| Our types/classes | `PascalCaseChirho` | `UserProfileChirho` |
| Our constants | `SCREAMING_SNAKE_CHIRHO` | `MAX_UPLOAD_SIZE_CHIRHO` |
| Our routes | `kebab-case-chirho` | `/users-chirho/` |
| Our API routes | `kebab-case-chirho` | `/api-chirho/users-chirho/` |
| Our DB tables | `snake_case_chirho` | `users_chirho` |
| Framework dirs | As required | `src/`, `routes/`, `lib/` |

### Workflow

```
1. Discuss feature with human
2. Update spec_chirho/ (YAML for data, MD for routes)
3. Get human approval
4. Generate outputs (types, schema, docs)
5. Generate migration (auto if safe, ask if destructive)
6. Implement routes/components
7. Update AI_PLAN_CHIRHO.md
8. Commit with [AI-CHIRHO] tag
9. Mark feature ✅ in 02_FEATURES_CHIRHO.md
```

### Files to Update

| When | Update |
|------|--------|
| After significant work | `AI_PLAN_CHIRHO.md` |
| New idea/tech debt found | `AI_SUGGESTIONS_CHIRHO.md` |
| Feature complete | `02_FEATURES_CHIRHO.md` |
| User-facing change | `DOCUMENTATION_CHIRHO.md` |
| Tech/tool added | `ACTIVE_CHIRHO.md` |
| New spec directory | Parent `SUMMARY_CHIRHO.md` |

### Commands

```bash
bun install                           # Install dependencies
bun run dev-chirho                    # Start dev server
bun run generate-all-chirho           # Generate all from spec
bun run generate-types-chirho         # Generate TypeScript types
bun run generate-schema-chirho        # Generate Drizzle schema
bun run generate-docs-chirho          # Generate HUMAN_CHIRHO.md files
bun run db-make-migrations-chirho     # Generate migration
bun run db-migrate-chirho             # Apply migrations
bun run test-unit-chirho              # Run unit tests
bun run test-e2e-chirho               # Run E2E tests
bun run validate-spec-chirho          # Validate YAML specs
```

---

## 20. Summary

This framework establishes **spec-driven development** where:

1. **Spec is truth** — All definitions live in `spec_chirho/` as YAML/Markdown
2. **YAML for data** — Parseable schema definitions generate all type artifacts
3. **Bidirectional sync** — Human edits to code can flow back to spec (with approval)
4. **Git determines authority** — `[AI-CHIRHO]` tag distinguishes AI vs human commits
5. **Chirho suffix identifies our code** — Easy to distinguish from third-party
6. **Templates guide patterns** — Framework-specific conventions in `templates_chirho/`
7. **Integrations guide setup** — External service guides in `integrations_chirho/`
8. **References provide context** — Business docs in `references_chirho/` inform implementation
9. **Tools are tracked** — `ACTIVE_CHIRHO.md` tracks what's in use
10. **AI self-documents** — `SUMMARY_CHIRHO.md` files aid context preservation

### Key Principles

| Principle | Implementation |
|-----------|----------------|
| Single source of truth | YAML files in `01_DATA_MODEL_CHIRHO/` |
| Generated files are read-only | `*.HUMAN_CHIRHO.md`, `schema.ts`, `types_chirho/` |
| Human approval required | Spec changes shown before implementing |
| Never silently diverge | Discrepancies trigger questions |
| Context preservation | `AI_PLAN_CHIRHO.md` updated after work |
| Research before implement | Check `references_chirho/` for business context |

---

> *"For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast."* — Ephesians 2:8-9

> *"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."* — Colossians 3:23

---

**JESUS CHRIST IS LORD**
