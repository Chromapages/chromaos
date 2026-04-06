# Navigation Structure

## Purpose
This document defines how navigation should be organized inside ChromaOS CRM.

The navigation needs to support fast internal use, multiple brands, and different record types without becoming cluttered.

---

## Primary Navigation

### Sidebar Navigation
Use a left sidebar as the main persistent navigation.

### Primary Nav Items
- Dashboard
- Leads
- Companies
- Deals
- Tasks
- Pipelines
- AI Actions
- Settings

These are the main operational areas and should always be visible.

---

## Secondary Navigation

### Utility / Lower-Priority Areas
- Contacts
- Activities

These can live lower in the sidebar or inside grouped sections.

---

## Route Mapping

| Nav Label | Route |
|---|---|
| Dashboard | `/dashboard` |
| Leads | `/leads` |
| Companies | `/companies` |
| Contacts | `/contacts` |
| Deals | `/deals` |
| Tasks | `/tasks` |
| Activities | `/activities` |
| Pipelines | `/pipelines` |
| AI Actions | `/ai-actions` |
| Settings | `/settings` |

---

## Brand Navigation Strategy

### Rule
Do not create separate top-level apps for each brand.

Instead:
- use one shared navigation
- use filters and pipeline routes for brand context
- surface brand views in `/pipelines/[brandSlug]` and filtered tables

### Why
This keeps the CRM unified and prevents fragmentation.

---

## Contextual Navigation

### Record Pages
On detail pages, the user should still have:
- global sidebar
- back navigation
- breadcrumbs or contextual header actions

### Recommended Detail Header Actions
- edit record
- create task
- create activity
- create deal
- run AI action

---

## Settings Navigation

### Settings Hub
`/settings`

### Child Settings Areas
- Brands
- Pipelines
- Users
- Templates

Settings should not dominate the main app nav. It should feel like admin support, not the main product.

---

## Quick Access Patterns

### Dashboard Quick Actions
Include shortcuts such as:
- Add Lead
- Add Task
- Create Deal
- Go To BuiltExpert Pipeline
- Go To Chromapages Pipeline
- Go To ServeStrategy Pipeline

### Record Quick Actions
Include:
- Add Note
- Add Task
- Create Deal
- Move Stage
- Run AI Action

---

## Navigation Principles

1. Most-used operational sections should be easiest to reach.
2. Brand context should be layered in through filters and pipeline routes.
3. Settings should remain secondary.
4. Navigation should optimize for daily use, not theoretical completeness.
5. Sidebar should stay stable so the app feels predictable.

---

## Recommendation
Keep navigation simple, repeatable, and operational. The user should never wonder where to go to:
- see leads
- see deals
- see tasks
- move pipeline stages
- trigger AI actions
