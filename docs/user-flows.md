# User Flows

## Purpose
This document defines the primary user journeys inside ChromaOS CRM.

Because this is an internal system, these flows focus on operational work rather than public customer journeys.

---

## Flow 1 — Login To Dashboard

### Goal
Get into the app and understand what needs attention.

### Steps
1. user opens `/login`
2. user authenticates
3. app routes to `/dashboard`
4. user sees:
   - leads by brand
   - leads by stage
   - overdue tasks
   - recent activity
   - open deals snapshot

### Success Condition
User understands current operational priorities quickly.

---

## Flow 2 — New Lead Intake To Qualification

### Goal
Capture a lead and make it usable.

### Steps
1. user creates lead
2. fills core fields
3. assigns brand, source, owner, and stage
4. saves lead
5. opens lead detail page
6. adds notes / tasks / company link if needed
7. qualifies fit

### Success Condition
Lead is no longer just raw input; it becomes an actionable record.

---

## Flow 3 — Lead Routing To Correct Brand

### Goal
Place the lead into the right brand pipeline.

### Steps
1. user reviews lead context
2. identifies vertical or intent
3. routes lead to Chromapages, BuiltExpert, or ServeStrategy
4. assigns pipeline and stage
5. optionally triggers AI classification

### Success Condition
Lead lands in the correct operational context.

---

## Flow 4 — Lead To Deal

### Goal
Convert a qualified lead into a tracked opportunity.

### Steps
1. open lead detail page
2. create deal
3. assign offer
4. assign amount and status
5. link company if needed
6. create follow-up task

### Success Condition
Opportunity is tracked as a deal, not just a note inside a lead.

---

## Flow 5 — Task Management

### Goal
Keep next actions from getting lost.

### Steps
1. user creates task from lead/company/deal
2. assigns owner and due date
3. task appears in tasks view and linked record
4. user completes or updates task
5. optional activity log is created

### Success Condition
Operational work is visible and tracked.

---

## Flow 6 — Activity Review

### Goal
Understand what happened on a record.

### Steps
1. user opens lead/company/deal
2. reviews timeline of activities
3. sees notes, stage changes, proposals, calls, or updates
4. uses history to decide next action

### Success Condition
User can reconstruct record history fast.

---

## Flow 7 — Pipeline Management

### Goal
Manage stage movement by brand.

### Steps
1. user opens `/pipelines/[brandSlug]`
2. views pipeline stages
3. reviews items in each stage
4. opens specific record or updates stage
5. activity entry captures movement

### Success Condition
Pipelines accurately reflect real status.

---

## Flow 8 — AI-Assisted Action

### Goal
Use OpenClaw agents inside workflow.

### Steps
1. user opens lead/company/deal
2. opens AI actions panel
3. selects action
4. system sends structured context
5. output is returned and stored
6. user reviews and decides next move

### Success Condition
AI output is useful, reviewable, and tied to a real record.

---

## Flow 9 — Cross-Brand Review

### Goal
Get multi-brand visibility from one place.

### Steps
1. user opens dashboard or leads table
2. filters by brand if needed
3. compares pipeline activity across brands
4. drills into records needing attention

### Success Condition
Owner gets one operational view across all businesses.

---

## MVP Priority Flows
If time gets tight, prioritize:
1. Login to Dashboard
2. New Lead Intake to Qualification
3. Lead Routing
4. Lead to Deal
5. Task Management
6. AI-Assisted Action

Those are the highest-leverage flows for version 1.
