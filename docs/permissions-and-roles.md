# Permissions And Roles

## Purpose
This document defines the role model and permissions assumptions for ChromaOS CRM MVP.

The goal is to keep access control simple enough to ship fast, while still protecting important configuration and internal data.

---

## Core Principle
ChromaOS CRM is an internal tool. In MVP:
- all authenticated internal users can access operational data
- config-heavy areas should be more restricted
- deletes should be limited
- complex role hierarchies should be avoided

---

## MVP Roles

### 1. Admin
Full internal control.

**Can:**
- read all records
- create/update all records
- manage brands
- manage pipelines and stages
- manage templates
- manage users
- access all settings
- perform sensitive config changes

### 2. Operator
Standard internal user.

**Can:**
- read operational records
- create/update leads, companies, contacts, deals, tasks, and activities
- move pipeline stages
- trigger AI actions
- use dashboard and main CRM views

**Cannot by default:**
- edit admin settings
- manage brand definitions
- manage pipeline definitions
- manage other users
- hard delete important records

---

## Collection-Level Intent

| Collection | Admin | Operator |
|---|---|---|
| users | Full | Read own / limited internal read |
| brands | Full | Read |
| pipelines | Full | Read |
| pipelineStages | Full | Read |
| leads | Full | Create/read/update |
| companies | Full | Create/read/update |
| contacts | Full | Create/read/update |
| deals | Full | Create/read/update |
| tasks | Full | Create/read/update |
| activities | Full | Create/read/create |
| agentRuns | Full | Read/create |
| templates | Full | Read |
| settings | Full | Limited/no write |

---

## Deletion Policy

### Recommendation
Avoid hard deletes in MVP for important collections.

### Better Pattern
Use:
- `status`
- `isArchived`
- or soft-delete fields later

### Reason
Hard deletes on CRM data create operational risk quickly.

---

## Ownership vs Access

### Recommendation
In MVP, assignment should help workflow, not heavily restrict access.

That means:
- `ownerUserId` helps clarify who is responsible
- but it does not need to fully gate read access yet

This keeps the system operationally simple.

---

## AI Permissions

### Admin
Can use all AI actions

### Operator
Can use operational AI actions such as:
- classify lead
- recommend next step
- analyze company
- generate notes

### Recommendation
Do not allow AI to automatically change important state in MVP without human review.

---

## Future Role Expansion
Later, roles may expand into:
- admin
- operator
- sales-only
- fulfillment-only
- brand-scoped operator
- analyst

Do not build this complexity before it is needed.

---

## MVP Recommendation
Keep the role system to:
- Admin
- Operator

That is enough to ship safely and avoid unnecessary permission complexity.
