# Screen Inventory

## Purpose
This document defines the screens required for ChromaOS CRM and what each screen is responsible for.

This is the screen-level operating map for the product.

---

## Auth Screens

### Login
**Route:** `/login`  
**Priority:** High  
**Purpose:** Authenticate internal users

---

## Dashboard Screens

### Dashboard
**Route:** `/dashboard`  
**Priority:** High  
**Purpose:** Show a cross-brand operational overview

**Must include:**
- summary stats
- leads by brand
- leads by stage
- overdue tasks
- recent activity
- open deals snapshot
- quick actions

---

## Leads

### Leads Table
**Route:** `/leads`  
**Priority:** High  
**Purpose:** Unified lead list across brands

### Lead Detail
**Route:** `/leads/[leadId]`  
**Priority:** High  
**Purpose:** Main working screen for lead qualification and routing

**Must include:**
- lead info
- stage / owner / brand
- company link
- tasks
- activity timeline
- linked deals
- AI actions panel

---

## Companies

### Companies Table
**Route:** `/companies`  
**Priority:** High  
**Purpose:** View company records

### Company Detail
**Route:** `/companies/[companyId]`  
**Priority:** High  
**Purpose:** Show company context, linked contacts, leads, deals, and activities

---

## Contacts

### Contacts Table
**Route:** `/contacts`  
**Priority:** Medium  
**Purpose:** Search and manage contact records

### Contact Detail
**Route:** `/contacts/[contactId]`  
**Priority:** Low/Medium  
**Purpose:** Show individual contact profile and linked company context

---

## Deals

### Deals Table
**Route:** `/deals`  
**Priority:** High  
**Purpose:** Unified opportunity tracking

### Deal Detail
**Route:** `/deals/[dealId]`  
**Priority:** High  
**Purpose:** Manage offer, value, stage, tasks, activities, and AI support

---

## Tasks

### Tasks View
**Route:** `/tasks`  
**Priority:** High  
**Purpose:** Show open and completed tasks

### Task Detail
**Route:** `/tasks/[taskId]`  
**Priority:** Low  
**Purpose:** Optional task detail screen if needed

---

## Activities

### Activities View
**Route:** `/activities`  
**Priority:** Medium  
**Purpose:** Global view of internal operational history

### Activity Detail
**Route:** `/activities/[activityId]`  
**Priority:** Low  
**Purpose:** Optional detail route if later needed

---

## Pipelines

### Pipelines Overview
**Route:** `/pipelines`  
**Priority:** High  
**Purpose:** Show all brand pipelines

### Brand Pipeline
**Route:** `/pipelines/[brandSlug]`  
**Priority:** High  
**Purpose:** Show brand-specific kanban/stage view

### Stage View
**Route:** `/pipelines/[brandSlug]/[stageSlug]`  
**Priority:** Low  
**Purpose:** Optional stage-specific filtered route

---

## AI

### AI Actions View
**Route:** `/ai-actions`  
**Priority:** Medium  
**Purpose:** Show stored agent runs and global AI activity

### Embedded AI Actions Panel
**Route:** inside lead/company/deal pages  
**Priority:** High  
**Purpose:** Trigger contextual AI actions from operational records

---

## Settings

### Settings Home
**Route:** `/settings`  
**Priority:** Medium  
**Purpose:** Settings entry page

### Brand Settings
**Route:** `/settings/brands`  
**Priority:** Medium  
**Purpose:** Manage brand definitions

### Pipeline Settings
**Route:** `/settings/pipelines`  
**Priority:** Medium  
**Purpose:** Manage pipeline definitions and stages

### User Settings
**Route:** `/settings/users`  
**Priority:** Low  
**Purpose:** Manage internal users and roles

### Templates
**Route:** `/settings/templates`  
**Priority:** Medium  
**Purpose:** Manage internal templates and reusable content

---

## MVP Required Screens
- Login
- Dashboard
- Leads Table
- Lead Detail
- Companies Table
- Company Detail
- Deals Table
- Deal Detail
- Tasks View
- Pipelines Overview
- Brand Pipeline
- Embedded AI Actions Panel
- Settings Home
- Brand Settings
- Pipeline Settings

---

## MVP Helpful But Not Mandatory
- Contacts Table
- Activities View
- AI Actions View
- Templates
- User Settings
