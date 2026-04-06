# Field Definitions

## Purpose
This document defines the meaning of important fields used across ChromaOS CRM.

It exists to keep field usage consistent across the app, Firestore, seed data, and AI actions.

---

## Shared Fields

### `id`
Unique record identifier.

### `createdAt`
Timestamp for initial record creation.

### `updatedAt`
Timestamp for last meaningful update.

### `status`
Operational status field for a record.

---

## Lead Fields

### `fullName`
Primary human contact name associated with the lead.

### `companyName`
Company name as submitted or known at intake.

### `source`
Top-level origin of the lead.
Examples:
- website
- referral
- outbound
- social
- paid_ads

### `sourceDetail`
More specific source detail.
Examples:
- BuiltExpert audit form
- referral from John
- LinkedIn inbound

### `brandId`
The brand the lead belongs to operationally.

### `pipelineId`
The pipeline the lead is currently assigned to.

### `stageId`
The current pipeline stage for the lead.

### `ownerUserId`
Internal user currently responsible for next action.

### `offerInterest`
The offer the lead appears most interested in.
Examples:
- Lead System Audit
- Contractor Websites
- Local SEO

### `tradeOrVertical`
Industry or market category.
Examples:
- HVAC
- Roofing
- Mission-Driven Organization
- SaaS

### `budgetRange`
Approximate budget expectation or fit range.

### `timeline`
Expected time horizon for action.

### `leadScore`
Internal score for quality or commercial potential.

### `fitScore`
Internal score for strategic fit with the right brand/offer.

### `nextAction`
Short human-readable next step.

### `notesSummary`
Short summary of lead context without reading full activity history.

---

## Company Fields

### `tradeOrIndustry`
The business category the company operates in.

### `region`
Geographic area or operational market.

### `brandContext`
Array of brands this company has interacted with.

### `primaryContactId`
The main contact ID tied to the company.

### `totalValue`
Total won revenue or expected value tied to the company.

---

## Deal Fields

### `offerName`
The named service or engagement tied to the opportunity.

### `amount`
Monetary value of the opportunity.

### `billingType`
How the deal is billed.
Examples:
- one_time
- monthly
- milestone_based

### `closeProbability`
Estimated likelihood of close as a percent or weighted score.

---

## Task Fields

### `linkedEntityType`
What kind of record the task belongs to.
Examples:
- lead
- company
- deal

### `linkedEntityId`
The ID of the linked record.

### `priority`
Task urgency level.
Examples:
- low
- medium
- high

---

## Activity Fields

### `activityType`
The kind of activity being logged.
Examples:
- note
- call
- email
- meeting
- proposal
- payment
- audit
- task_update
- stage_change

### `title`
Short scan-friendly title for the timeline item.

### `note`
Longer context or details if needed.

---

## Agent Run Fields

### `agentName`
Which OpenClaw agent ran.
Examples:
- chroma
- prism
- bender
- canvas
- pixel

### `actionType`
What action was performed.
Examples:
- classify_lead
- recommend_next_step
- analyze_website
- generate_scope_notes

### `inputSummary`
Short summary of what context the agent received.

### `output`
Stored result from the agent action.

---

## Recommendation
Keep field names stable and intentional. If a field starts doing multiple jobs, split it rather than letting it become vague.
