# Sitemap

## Purpose
This document defines the app-level route structure and page hierarchy for ChromaOS CRM.

The goal is to keep the internal CRM easy to navigate while supporting multiple brands, multiple pipelines, and multiple record types inside one system.

---

## Core Navigation Areas

### Primary App Sections
- Dashboard
- Leads
- Companies
- Contacts
- Deals
- Tasks
- Activities
- Pipelines
- AI Actions
- Settings

### Auth Section
- Login

---

## Route Structure

## Auth
- `/login`

## Dashboard
- `/dashboard`

## Leads
- `/leads`
- `/leads/[leadId]`

## Companies
- `/companies`
- `/companies/[companyId]`

## Contacts
- `/contacts`
- `/contacts/[contactId]`

## Deals
- `/deals`
- `/deals/[dealId]`

## Tasks
- `/tasks`
- `/tasks/[taskId]` (optional in MVP)

## Activities
- `/activities`
- `/activities/[activityId]` (optional in MVP)

## Pipelines
- `/pipelines`
- `/pipelines/[brandSlug]`
- `/pipelines/[brandSlug]/[stageSlug]` (optional filtered stage route)

## AI Actions
- `/ai-actions`

## Settings
- `/settings`
- `/settings/brands`
- `/settings/pipelines`
- `/settings/users`
- `/settings/templates`

---

## Hierarchy

```txt
/login
/dashboard
/leads
  /leads/[leadId]
/companies
  /companies/[companyId]
/contacts
  /contacts/[contactId]
/deals
  /deals/[dealId]
/tasks
  /tasks/[taskId]
/activities
  /activities/[activityId]
/pipelines
  /pipelines/[brandSlug]
  /pipelines/[brandSlug]/[stageSlug]
/ai-actions
/settings
  /settings/brands
  /settings/pipelines
  /settings/users
  /settings/templates
```

---

## Priority Levels

### High Priority
- `/login`
- `/dashboard`
- `/leads`
- `/leads/[leadId]`
- `/companies`
- `/companies/[companyId]`
- `/deals`
- `/deals/[dealId]`
- `/tasks`
- `/pipelines`
- `/pipelines/[brandSlug]`

### Medium Priority
- `/contacts`
- `/activities`
- `/ai-actions`
- `/settings`
- `/settings/brands`
- `/settings/pipelines`
- `/settings/templates`

### Low Priority
- `/contacts/[contactId]`
- `/tasks/[taskId]`
- `/activities/[activityId]`
- `/settings/users`
- `/pipelines/[brandSlug]/[stageSlug]`

---

## Navigation Intent

### Dashboard
Global operational overview

### Leads
Primary working area for intake, qualification, and routing

### Companies
Business-level context and relationship tracking

### Deals
Opportunity and revenue tracking

### Tasks
Daily action management

### Pipelines
Brand-specific sales flow management

### AI Actions
Central view of agent activity and outputs

### Settings
Admin and internal system configuration

---

## Navigation Principle
This should feel like:
- one shared CRM
- multiple brand contexts
- easy operational movement

Not:
- separate mini-apps bolted together
