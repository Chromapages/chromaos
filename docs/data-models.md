# Data Models

## Purpose
This document defines the core product-level entities for ChromaOS CRM.

These are the business objects the CRM needs to manage. Firebase-specific collection structure is covered separately in `firestore-schema.md`.

---

## Core Entities

### 1. User
Represents an internal authenticated user of the CRM.

**Core responsibilities:**
- owns leads, tasks, or deals
- triggers AI actions
- updates records
- manages settings if admin

**Core fields:**
- id
- fullName
- email
- role
- isActive
- defaultBrandId
- createdAt
- updatedAt

---

### 2. Brand
Represents a business brand inside the parent system.

**Examples:**
- Chromapages
- BuiltExpert
- ServeStrategy

**Core fields:**
- id
- name
- slug
- parentBrandId
- isActive
- defaultPipelineId
- createdAt
- updatedAt

---

### 3. Pipeline
Represents a brand-specific sales workflow.

**Core fields:**
- id
- brandId
- name
- slug
- isDefault
- stageIds
- createdAt
- updatedAt

---

### 4. Pipeline Stage
Represents a stage inside a pipeline.

**Core fields:**
- id
- pipelineId
- name
- slug
- order
- color
- isClosedWon
- isClosedLost
- createdAt
- updatedAt

---

### 5. Lead
Represents an inbound or outbound sales opportunity before or during qualification.

**Core fields:**
- id
- fullName
- companyName
- email
- phone
- website
- source
- sourceDetail
- brandId
- pipelineId
- stageId
- ownerUserId
- offerInterest
- tradeOrVertical
- budgetRange
- timeline
- leadScore
- fitScore
- nextAction
- notesSummary
- status
- companyId
- createdAt
- updatedAt

---

### 6. Company
Represents a business entity tied to leads, contacts, and deals.

**Core fields:**
- id
- name
- website
- tradeOrIndustry
- region
- brandContext
- primaryContactId
- ownerUserId
- status
- totalValue
- notesSummary
- createdAt
- updatedAt

---

### 7. Contact
Represents a person inside a company.

**Core fields:**
- id
- companyId
- fullName
- email
- phone
- role
- notesSummary
- createdAt
- updatedAt

---

### 8. Deal
Represents a qualified revenue opportunity.

**Core fields:**
- id
- leadId
- companyId
- brandId
- pipelineId
- stageId
- offerName
- amount
- billingType
- status
- closeProbability
- ownerUserId
- notesSummary
- createdAt
- updatedAt

---

### 9. Task
Represents an action item tied to a record.

**Core fields:**
- id
- linkedEntityType
- linkedEntityId
- title
- description
- ownerUserId
- dueDate
- priority
- status
- createdAt
- updatedAt

---

### 10. Activity
Represents a timeline event or note.

**Examples:**
- note
- call
- email
- meeting
- proposal
- payment
- audit
- task update
- stage change

**Core fields:**
- id
- linkedEntityType
- linkedEntityId
- activityType
- title
- note
- createdByUserId
- createdAt

---

### 11. Agent Run
Represents a stored AI action execution.

**Core fields:**
- id
- linkedEntityType
- linkedEntityId
- agentName
- actionType
- inputSummary
- output
- createdByUserId
- createdAt

---

### 12. Template
Represents reusable internal templates.

**Examples:**
- proposal skeleton
- follow-up template
- audit note template
- AI prompt template

**Core fields:**
- id
- type
- name
- content
- isActive
- createdAt
- updatedAt

---

### 13. Settings
Represents app-level or system-level configuration documents.

**Examples:**
- global settings
- feature flags later
- internal defaults

---

## Relationship Summary

### Lead
May link to:
- one brand
- one pipeline
- one stage
- zero or one company
- many activities
- many tasks
- many agent runs
- zero or more deals

### Company
May link to:
- many contacts
- many leads
- many deals
- many activities
- many tasks

### Deal
May link to:
- one lead
- one company
- one brand
- one pipeline
- one stage
- many activities
- many tasks

---

## Modeling Principles
1. Keep relationships explicit with IDs.
2. Keep shapes predictable across records.
3. Prefer top-level collections over deep nesting in MVP.
4. Treat activities and agent runs as important operational records.
5. Keep ownership and stage references first-class, not buried in notes.
