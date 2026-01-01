# For God so loved the world, that He gave His only begotten Son, that all who believe in Him should not perish but have everlasting life. — John 3:16

# OpenOrphanage - Transparent Global Orphan Care Administration

> **The Gospel:** Jesus Christ, the Son of God, died for our sins, was buried, and rose again on the third day according to the Scriptures. Whoever believes in Him shall not perish but have eternal life. (1 Corinthians 15:3-4, John 3:16)

> *"Religion that is pure and undefiled before God the Father is this: to visit orphans and widows in their affliction."* — James 1:27

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

## Vision

> *"I will not leave you as orphans; I will come to you."* — John 14:18 (Jesus speaking)

OpenOrphanage exists because:
- **Orphans are precious to God** — Scripture is clear that caring for orphans is central to true religion
- **Transparency builds trust** — Donors give more when they can see exactly where funds go
- **Technology can serve love** — Digital tools can amplify human compassion, not replace it
- **The journey doesn't end at 18** — We're building a pipeline to flourishing, not just survival

---

## Core Features

### 1. Orphanage Administration Dashboard

```yaml
dashboard_features_chirho:
  child_management:
    - Individual child profiles with photo, history, needs
    - Health records and medical tracking
    - Educational progress monitoring
    - Sponsorship status and communications
    - Transition planning (aging out, adoption, family reunification)

  resource_management:
    - Inventory tracking (food, clothing, supplies)
    - Financial accounting with full audit trail
    - Staff scheduling and management
    - Facility maintenance logs
    - Donation tracking and allocation

  reporting:
    - Monthly impact reports for donors
    - Real-time dashboards for administrators
    - Compliance reports for government/regulators
    - Annual transparency reports
```

### 2. Donor Integration (via KingdomInvest.ing)

```yaml
donor_features_chirho:
  transparency:
    - Real-time fund allocation visibility
    - Photo/video updates from orphanages
    - Need-specific giving (food, education, medical)
    - Impact metrics and outcomes tracking

  engagement:
    - Prayer request notifications
    - Volunteer opportunity matching
    - Sponsor-to-child communication
    - Visit scheduling for verified donors
```

### 3. Child Sponsorship (via MakingFriends.faith)

```yaml
sponsorship_integration_chirho:
  matching:
    - Age-appropriate sponsor matching
    - Interest-based connections
    - Long-term relationship tracking
    - Communication facilitation

  development:
    - Educational goal tracking
    - Spiritual growth milestones
    - Life skills development
    - Career interest identification
```

### 4. Education Pipeline (via SonshineCoders.org)

```yaml
education_pipeline_chirho:
  assessment:
    - Aptitude testing for technology
    - Interest surveys
    - Readiness evaluation

  enrollment:
    - Scholarship application processing
    - Curriculum placement
    - Mentor matching

  tracking:
    - Course progress monitoring
    - Skill certification
    - Portfolio development
    - Job readiness scoring
```

### 5. Employment Launch (via Koinainia.com)

```yaml
employment_launch_chirho:
  preparation:
    - Resume/portfolio building
    - Interview preparation
    - Professional networking

  placement:
    - Job matching with certified integrators
    - Freelance opportunity connection
    - Apprenticeship programs

  support:
    - Ongoing mentorship
    - Career advancement tracking
    - Financial literacy training
```

---

## Technical Architecture

### Tech Stack

```yaml
tech_stack_chirho:
  frontend:
    - SvelteKit 2.x
    - Tailwind CSS 4.x
    - TypeScript

  backend:
    - Cloudflare Workers
    - D1 Database (SQLite)
    - R2 Storage (media files)
    - Durable Objects (real-time features)

  integrations:
    - KingdomInvest.ing API (donations, campaigns)
    - MakingFriends.faith API (sponsorships)
    - SonshineCoders.org API (education)
    - Koinainia.com API (employment)
    - FaithStack Trust Network (verification)
```

### Database Schema (Planned)

```yaml
core_tables_chirho:
  orphanages_chirho:
    - id, name, location, capacity
    - verification_status, trust_score
    - admin_users, contact_info
    - founding_date, mission_statement

  children_chirho:
    - id, orphanage_id, name, birth_date
    - entry_date, status (in_care, transitioned, adopted)
    - sponsorship_id, education_level
    - health_status, special_needs
    - transition_plan, career_interests

  needs_chirho:
    - id, orphanage_id, child_id (optional)
    - type (food, medical, education, clothing, facility)
    - description, estimated_cost
    - priority, status, fulfilled_date
    - linked_campaign_id

  staff_chirho:
    - id, orphanage_id, name, role
    - verification_status, background_check
    - start_date, certifications

  finances_chirho:
    - id, orphanage_id, type (income, expense)
    - amount, category, description
    - date, verified_by, receipt_url

  sponsors_chirho:
    - id, child_id, donor_id
    - start_date, status
    - communication_preferences
    - last_update_sent
```

---

## User Roles

### 1. Orphanage Administrators
- Manage child records and staff
- Track resources and finances
- Submit needs to KingdomInvest.ing
- Generate transparency reports

### 2. Caregivers/Staff
- Daily care logging
- Health and education updates
- Communication with sponsors
- Activity scheduling

### 3. Donors/Sponsors (via integrations)
- View orphanage dashboards
- Track sponsored children
- See fund allocation
- Receive impact updates

### 4. Verifiers (FaithStack Trust Network)
- Conduct site visits
- Verify financial records
- Confirm child welfare
- Issue trust certificates

### 5. Transition Coordinators
- Track aging-out children
- Coordinate with SonshineCoders
- Facilitate Koinainia onboarding
- Monitor post-transition success

---

## API Endpoints (Planned)

```yaml
api_endpoints_chirho:
  public:
    GET /api-chirho/orphanages-chirho        # List verified orphanages
    GET /api-chirho/needs-chirho             # Current needs (for KingdomInvest.ing)
    GET /api-chirho/impact-chirho            # Aggregate impact metrics

  authenticated:
    # Orphanage management
    POST /api-chirho/orphanages-chirho       # Register new orphanage
    PUT /api-chirho/orphanages-chirho/:id    # Update orphanage info

    # Child management
    GET /api-chirho/children-chirho          # List children (filtered)
    POST /api-chirho/children-chirho         # Add child record
    PUT /api-chirho/children-chirho/:id      # Update child record

    # Needs management
    POST /api-chirho/needs-chirho            # Create new need
    PUT /api-chirho/needs-chirho/:id         # Update need status

    # Financial tracking
    POST /api-chirho/finances-chirho         # Log transaction
    GET /api-chirho/finances-chirho/report   # Generate financial report

  webhooks:
    POST /webhook-chirho/kingdominvest       # Donation notifications
    POST /webhook-chirho/makingfriends       # Sponsorship updates
    POST /webhook-chirho/sonshinecoders      # Education milestones
    POST /webhook-chirho/koinainia           # Employment updates
```

---

## Privacy & Security

### Child Protection

```yaml
child_protection_chirho:
  data_privacy:
    - No public display of full names or identifying details
    - Photo consent required and logged
    - Sponsor communication moderated
    - Location data restricted

  access_control:
    - Role-based permissions
    - Audit logging for all child record access
    - Two-factor authentication for admin functions
    - Background check verification for staff

  content_moderation:
    - All sponsor messages reviewed before delivery
    - AI-assisted content filtering
    - Inappropriate content flagging
    - Emergency escalation procedures
```

---

## Integration Points

### KingdomInvest.ing

```typescript
// Push needs to KingdomInvest.ing
async function publishNeedChirho(needChirho: NeedChirho) {
  await fetch('https://kingdominvest.ing/api-chirho/external-needs-chirho', {
    method: 'POST',
    headers: { 'X-API-Key': env.KINGDOMINVEST_API_KEY_CHIRHO },
    body: JSON.stringify({
      sourceChirho: 'openorphanage',
      orphanageIdChirho: needChirho.orphanageIdChirho,
      typeChirho: needChirho.typeChirho,
      amountChirho: needChirho.estimatedCostChirho,
      descriptionChirho: needChirho.descriptionChirho
    })
  });
}
```

### MakingFriends.faith

```typescript
// Sync sponsorship data
async function syncSponsorshipChirho(childIdChirho: string) {
  const sponsorshipChirho = await fetch(
    `https://makingfriends.faith/api-chirho/sponsorships-chirho/${childIdChirho}`,
    { headers: { 'X-API-Key': env.MAKINGFRIENDS_API_KEY_CHIRHO } }
  );
  return sponsorshipChirho.json();
}
```

### SonshineCoders.org

```typescript
// Enroll aging-out youth
async function enrollInEducationChirho(youthChirho: TransitionYouthChirho) {
  await fetch('https://sonshinecoders.org/api-chirho/scholarships-chirho', {
    method: 'POST',
    headers: { 'X-API-Key': env.SONSHINECODERS_API_KEY_CHIRHO },
    body: JSON.stringify({
      nameChirho: youthChirho.nameChirho,
      ageChirho: youthChirho.ageChirho,
      orphanageIdChirho: youthChirho.orphanageIdChirho,
      interestsChirho: youthChirho.careerInterestsChirho,
      supportNeedsChirho: youthChirho.supportNeedsChirho
    })
  });
}
```

---

## Directory Structure

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
│   ├── app.d.ts
│   │
│   ├── lib/
│   │   ├── components/
│   │   │   ├── OrphanageDashboardChirho.svelte
│   │   │   ├── ChildProfileChirho.svelte
│   │   │   ├── NeedCardChirho.svelte
│   │   │   ├── TransparencyReportChirho.svelte
│   │   │   └── JourneyTimelineChirho.svelte
│   │   │
│   │   ├── server/
│   │   │   ├── db_chirho.ts
│   │   │   ├── auth_chirho.ts
│   │   │   └── integrations_chirho/
│   │   │       ├── kingdominvest_chirho.ts
│   │   │       ├── makingfriends_chirho.ts
│   │   │       ├── sonshinecoders_chirho.ts
│   │   │       └── koinainia_chirho.ts
│   │   │
│   │   └── types_chirho.ts
│   │
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte         # Public landing
│       │
│       ├── orphanages-chirho/
│       │   ├── +page.svelte     # Browse orphanages
│       │   └── [id]-chirho/
│       │       └── +page.svelte # Orphanage detail
│       │
│       ├── dashboard-chirho/    # Admin dashboard
│       │   ├── +page.svelte
│       │   ├── children-chirho/
│       │   ├── needs-chirho/
│       │   ├── finances-chirho/
│       │   └── reports-chirho/
│       │
│       ├── journey-chirho/      # The complete journey
│       │   └── +page.svelte
│       │
│       └── api-chirho/          # API endpoints
│           ├── orphanages-chirho/
│           ├── children-chirho/
│           ├── needs-chirho/
│           └── webhook-chirho/
│
└── static/
    ├── favicon.ico
    └── images/
```

---

## Development Commands

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
```

---

## Roadmap

### Phase 1: Foundation (Current)
- [ ] Landing page with vision
- [ ] Basic orphanage registration
- [ ] Simple child record keeping
- [ ] Integration with FaithStack

### Phase 2: Core Features
- [ ] Full dashboard implementation
- [ ] KingdomInvest.ing needs integration
- [ ] MakingFriends.faith sponsorship sync
- [ ] Transparency reporting

### Phase 3: Education Pipeline
- [ ] SonshineCoders.org scholarship integration
- [ ] Career interest tracking
- [ ] Skill assessment tools
- [ ] Transition planning dashboard

### Phase 4: Employment Launch
- [ ] Koinainia.com job matching
- [ ] Portfolio integration
- [ ] Success tracking
- [ ] Alumni network

---

## Scripture Foundation

> *"Defend the weak and the fatherless; uphold the cause of the poor and the oppressed."* — Psalm 82:3

> *"Learn to do right; seek justice. Defend the oppressed. Take up the cause of the fatherless."* — Isaiah 1:17

> *"He defends the cause of the fatherless and the widow."* — Deuteronomy 10:18

> *"A father to the fatherless, a defender of widows, is God in his holy dwelling."* — Psalm 68:5

---

**In Jesus' Name, we build technology that serves the least of these, walking with them from vulnerability to flourishing.**

---

**JESUS CHRIST IS LORD**
