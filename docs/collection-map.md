# Collection Map

## Purpose
This document maps each Firestore collection to its operational purpose inside ChromaOS CRM.

It exists to make the system easier to reason about during implementation.

---

## Collection Overview

| Collection | Purpose | Query Style | MVP Priority |
|---|---|---|---:|
| `users` | Internal user profiles | low-volume direct lookup | High |
| `brands` | Brand definitions | small config lookups | High |
| `pipelines` | Brand pipeline definitions | config lookups | High |
| `pipelineStages` | Ordered stage definitions | config lookups + stage joins | High |
| `leads` | Core lead records | high-frequency table/filter queries | High |
| `companies` | Company records | medium-frequency table/detail queries | High |
| `contacts` | Contact records | medium-frequency relationship queries | Medium |
| `deals` | Opportunities/revenue tracking | high-frequency table/filter queries | High |
| `tasks` | Action management | high-frequency by owner/due date | High |
| `activities` | Record timelines/history | linked-entity queries | High |
| `agentRuns` | Stored AI outputs | linked-entity + agent queries | High |
| `templates` | Reusable internal templates | low-frequency config queries | Medium |
| `settings` | App config / system docs | direct lookup | Medium |

---

## Operational Purpose By Collection

## `users`
Stores internal user identity and role context.

Used for:
- ownership assignment
- auth-linked profile reads
- role checks
- task/deal/lead ownership

---

## `brands`
Stores business brand definitions.

Used for:
- cross-brand filtering
- brand routing
- default pipeline references
- future scaling to more sub-brands

---

## `pipelines`
Stores brand-specific pipeline definitions.

Used for:
- pipeline overview
- brand pipeline screens
- stage grouping
- stage relationship mapping

---

## `pipelineStages`
Stores stage records for each pipeline.

Used for:
- stage display
- ordering
- closed-won / closed-lost logic
- stage movement

---

## `leads`
Stores sales leads before and during qualification.

Used for:
- intake
- qualification
- routing
- stage movement
- AI lead actions

---

## `companies`
Stores business/account records.

Used for:
- linking leads to companies
- linking deals to companies
- maintaining company-level context
- tracking total value later

---

## `contacts`
Stores person-level records tied to companies.

Used for:
- primary contact info
- future contact relationship support
- company detail views

---

## `deals`
Stores opportunity records.

Used for:
- proposal-stage tracking
- revenue visibility
- offer tracking
- close status

---

## `tasks`
Stores next actions and operational to-dos.

Used for:
- follow-up discipline
- due-date visibility
- owner-specific work management
- linked record action context

---

## `activities`
Stores timeline/history items.

Used for:
- notes
- calls
- emails
- meetings
- stage changes
- proposal events
- operational history

---

## `agentRuns`
Stores AI-generated outputs.

Used for:
- record-level AI output history
- audit notes
- classification results
- recommendation logs
- proposal prep notes

---

## `templates`
Stores reusable internal content.

Used for:
- proposal skeletons
- follow-up templates
- prompt templates
- future automation support

---

## `settings`
Stores app-level configuration records.

Used for:
- app defaults
- system values
- future toggles or admin config

---

## Recommendation
Treat these collections as operational infrastructure. Keep names stable, shapes predictable, and query patterns intentional.
