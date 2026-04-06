# Core Workflows

## Purpose
This document defines the essential workflows ChromaOS CRM must support in version 1.

If the system does not support these workflows cleanly, it is not operationally ready.

---

## Workflow 1 — New Lead Intake

### Goal
Capture a new lead and place it into the correct brand and stage.

### Steps
1. create or receive lead
2. assign brand
3. assign owner
4. assign source
5. assign initial stage
6. record offer interest if known
7. create next action or task

### Output
A usable lead record with enough context to act on.

---

## Workflow 2 — Lead Qualification

### Goal
Determine fit and likely next step.

### Steps
1. review lead details
2. review company/website context
3. determine brand fit
4. determine offer fit
5. update stage
6. add notes
7. create follow-up task
8. optionally trigger AI classification

### Output
Lead is qualified, disqualified, or routed.

---

## Workflow 3 — Brand Routing

### Goal
Route the lead into the correct brand pipeline.

### Example Routes
- contractor lead -> BuiltExpert
- mission-driven org lead -> ServeStrategy
- broad digital studio lead -> Chromapages

### Steps
1. identify intent
2. identify industry/vertical fit
3. assign brand
4. assign pipeline/stage
5. optionally store routing rationale
6. trigger supporting AI actions if needed

### Output
Lead appears in the correct operational context.

---

## Workflow 4 — Deal Creation

### Goal
Turn a qualified lead into a tracked opportunity.

### Steps
1. open lead
2. create deal
3. attach company/contact if needed
4. assign offer
5. assign amount
6. assign stage/status
7. create next-step task

### Output
A tracked deal linked to the correct lead and company.

---

## Workflow 5 — Task Management

### Goal
Ensure important next steps do not get lost.

### Steps
1. create task from lead/company/deal
2. assign owner
3. set due date
4. set priority
5. complete or update task
6. log result if needed

### Output
The CRM becomes the operational reminder system instead of relying on memory.

---

## Workflow 6 — Activity Logging

### Goal
Create a reliable timeline of what happened.

### Activity Types
- note
- call
- email
- meeting
- proposal
- payment
- audit
- task update
- stage change

### Steps
1. add activity
2. attach it to record
3. timestamp automatically
4. show in timeline order

### Output
Anyone reviewing a record can quickly understand history.

---

## Workflow 7 — Stage Movement

### Goal
Move leads and deals through brand-specific pipeline stages.

### Steps
1. open pipeline or record
2. change stage
3. save stage
4. log activity
5. optionally trigger next task later

### Output
Pipelines stay accurate and usable.

---

## Workflow 8 — AI-Assisted Review

### Goal
Let OpenClaw agents accelerate analysis and execution support.

### Example AI Actions
- classify lead
- summarize company website
- recommend next step
- generate proposal notes
- prepare audit notes

### Steps
1. open lead/company/deal
2. trigger AI action
3. send structured context
4. receive output
5. store output in CRM
6. operator reviews and decides next move

### Output
AI supports the workflow without replacing operator judgment.

---

## Workflow 9 — Proposal / Scope Prep

### Goal
Speed up transition from qualified lead to actionable proposal work.

### Steps
1. review lead/company context
2. confirm likely offer
3. review notes and stage
4. trigger AI support if needed
5. generate proposal or scope notes
6. advance stage

### Output
Proposal prep becomes faster and more consistent.

---

## Workflow 10 — Cross-Brand Visibility

### Goal
Let the owner understand what is happening across all businesses from one system.

### Steps
1. open dashboard
2. review leads by brand
3. review deals by stage
4. review overdue tasks
5. review recent activity
6. jump into the correct pipeline or record

### Output
One system gives real operational clarity across all brands.\n