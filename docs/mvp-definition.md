# MVP Definition

## Purpose
This document defines the minimum viable product for ChromaOS CRM.

The MVP is the smallest version of the system that is genuinely useful for running multi-brand internal sales and CRM operations.

## MVP Goal
Create a Firebase-based internal CRM that can:
- track leads across brands
- manage brand-specific pipelines
- store companies and contacts
- track deals
- manage tasks and activity history
- support embedded AI-assisted actions

---

## MVP Must-Haves

### 1. Authentication
- Firebase Auth
- internal login
- protected app routes

### 2. Leads Module
- create lead
- update lead
- assign brand
- assign owner
- assign stage
- assign offer interest
- filter/search leads
- lead detail page

### 3. Companies / Contacts
- create company
- link lead to company
- create contact
- company detail page showing linked records

### 4. Deals
- create deal
- attach to lead/company
- assign offer
- assign amount
- assign status/stage
- deal detail page

### 5. Tasks
- create task
- assign owner
- due date
- priority
- mark complete
- link task to lead/company/deal

### 6. Activities
- create note/activity entry
- log important events
- show record timeline

### 7. Pipelines
- pipeline definitions by brand
- stage definitions by brand
- stage movement
- basic kanban or stage-based view

### 8. Dashboard
At minimum show:
- leads by brand
- leads by stage
- overdue tasks
- recent activity
- deals snapshot

### 9. AI Actions
At minimum support:
- classify lead
- recommend next step
- analyze website/company context
- generate proposal notes
- generate audit prep notes

AI outputs must be stored back into CRM.

---

## MVP Should-Haves
If time allows:
- global search
- saved filters
- quick-create actions
- attachments
- global AI action log page
- templates page

---

## Not MVP
These are intentionally outside version 1:
- public-facing CRM features
- client portal
- email sync
- calendar sync
- billing/invoicing system
- automation builder
- deep reporting suite
- advanced notification engine
- full project management platform

---

## MVP Completion Test
The MVP is complete when Eric can:
1. log in
2. view all leads across brands
3. filter by brand and stage
4. open a lead and understand context
5. create and complete tasks
6. create and track deals
7. move records through pipelines
8. trigger AI actions from records
9. use the app as the default internal CRM

---

## MVP Standard
The first version does not need to be perfect.  
It does need to be:
- stable
- structured
- faster than the current manual workflow
- Firebase-native
- easy to extend later\n