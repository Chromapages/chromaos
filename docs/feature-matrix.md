# Feature Matrix

## Purpose
This document maps ChromaOS CRM features by module and indicates whether they are required for MVP, helpful for v1, or deferred.

---

## Feature Status Legend
- **MVP** = required in first usable version
- **V1+** = useful soon after MVP
- **Later** = explicitly deferred

---

## Auth

| Feature | Status | Notes |
|---|---|---|
| Firebase Auth login | MVP | Required |
| Protected routes | MVP | Required |
| User profile support | MVP | Basic only |
| Multi-role advanced permissions | Later | Keep simple at first |

---

## Dashboard

| Feature | Status | Notes |
|---|---|---|
| Summary stats | MVP | Required |
| Leads by brand | MVP | Required |
| Leads by stage | MVP | Required |
| Overdue tasks | MVP | Required |
| Recent activity | MVP | Required |
| Open deals snapshot | MVP | Required |
| Advanced trend charts | Later | Not needed first |

---

## Leads

| Feature | Status | Notes |
|---|---|---|
| Create/update leads | MVP | Required |
| Lead table filters | MVP | Required |
| Lead detail page | MVP | Required |
| Global search | V1+ | Useful |
| Bulk actions | Later | Not required |

---

## Companies / Contacts

| Feature | Status | Notes |
|---|---|---|
| Company records | MVP | Required |
| Contact records | MVP | Basic support |
| Linked lead/company relationships | MVP | Required |
| Rich contact management | V1+ | Useful later |

---

## Deals

| Feature | Status | Notes |
|---|---|---|
| Create/update deals | MVP | Required |
| Deal table | MVP | Required |
| Deal detail page | MVP | Required |
| Revenue forecasting | Later | Deferred |

---

## Tasks

| Feature | Status | Notes |
|---|---|---|
| Create/update tasks | MVP | Required |
| Task list view | MVP | Required |
| Task completion | MVP | Required |
| Task templates | V1+ | Useful soon |
| Advanced reminders | Later | Deferred |

---

## Activities

| Feature | Status | Notes |
|---|---|---|
| Add note/activity | MVP | Required |
| Timeline on records | MVP | Required |
| Global activities view | V1+ | Helpful |
| Advanced audit trail controls | Later | Deferred |

---

## Pipelines

| Feature | Status | Notes |
|---|---|---|
| Brand-specific pipeline definitions | MVP | Required |
| Stage movement | MVP | Required |
| Kanban or stage view | MVP | Required |
| Drag-and-drop polish | V1+ | Nice but not required |
| Conversion analytics | Later | Deferred |

---

## AI Actions

| Feature | Status | Notes |
|---|---|---|
| Record-level AI actions panel | MVP | Required |
| Store agent outputs | MVP | Required |
| Lead classification | MVP | Required |
| Next-step recommendation | MVP | Required |
| Website/company analysis | MVP | Required |
| Proposal notes generation | MVP | Required |
| Global AI runs page | V1+ | Useful |
| AI auto-state mutation | Later | Avoid in MVP |

---

## Settings

| Feature | Status | Notes |
|---|---|---|
| Brands settings | MVP | Required |
| Pipelines settings | MVP | Required |
| Templates settings | V1+ | Useful |
| Users settings | V1+ | Basic |
| Deep admin controls | Later | Deferred |

---

## Integrations

| Feature | Status | Notes |
|---|---|---|
| Firebase integration | MVP | Required |
| OpenClaw action hooks | MVP | Required |
| Stripe sync | Later | Not part of core CRM yet |
| Email inbox sync | Later | Deferred |
| Calendar sync | Later | Deferred |

---

## Recommendation
If prioritization gets tight, keep:
- leads
- deals
- tasks
- pipelines
- AI actions
- dashboard

Those are the core value drivers.
