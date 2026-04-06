# Indexing Plan

## Purpose
This document defines the expected Firestore indexing needs for ChromaOS CRM MVP.

Because the app depends heavily on filtered operational views, indexes need to be planned early rather than discovered only through runtime errors.

---

## Core Indexing Principle
Indexes should support the queries that power:
- leads table
- deals table
- tasks view
- dashboard widgets
- pipeline views
- record-linked activity and agent run views

---

## Collection Index Priorities

## `leads`
This is one of the highest-priority indexed collections.

### Expected Query Patterns
- by brand + stage
- by brand + owner
- by source + brand
- by stage + updatedAt
- by owner + updatedAt
- by brand + createdAt

### Recommended Composite Indexes
- `brandId ASC, stageId ASC, updatedAt DESC`
- `brandId ASC, ownerUserId ASC, updatedAt DESC`
- `brandId ASC, source ASC, createdAt DESC`
- `stageId ASC, updatedAt DESC`

---

## `deals`
### Expected Query Patterns
- by brand + stage
- by owner + status
- by brand + createdAt
- by status + updatedAt

### Recommended Composite Indexes
- `brandId ASC, stageId ASC, updatedAt DESC`
- `ownerUserId ASC, status ASC, updatedAt DESC`
- `brandId ASC, createdAt DESC`

---

## `tasks`
### Expected Query Patterns
- by owner + status
- by owner + dueDate
- by status + dueDate
- by linkedEntityType + linkedEntityId

### Recommended Composite Indexes
- `ownerUserId ASC, status ASC, dueDate ASC`
- `status ASC, dueDate ASC`
- `linkedEntityType ASC, linkedEntityId ASC, createdAt DESC`

---

## `activities`
### Expected Query Patterns
- by linkedEntityType + linkedEntityId
- by createdAt descending for recent activity views

### Recommended Composite Indexes
- `linkedEntityType ASC, linkedEntityId ASC, createdAt DESC`

---

## `agentRuns`
### Expected Query Patterns
- by linkedEntityType + linkedEntityId
- by agentName + createdAt
- by createdAt descending for global AI actions page

### Recommended Composite Indexes
- `linkedEntityType ASC, linkedEntityId ASC, createdAt DESC`
- `agentName ASC, createdAt DESC`

---

## `companies`
### Expected Query Patterns
- by owner
- by status
- by createdAt

### Recommendation
Single-field indexes may be enough early unless more complex filtering is added.

---

## `contacts`
### Expected Query Patterns
- by companyId
- by createdAt

### Recommendation
Likely simple enough for MVP.

---

## Dashboard Query Support

### Dashboard Will Need
- leads by brand
- leads by stage
- overdue tasks
- recent activities
- open deals snapshot

### Recommendation
Use a mix of:
- indexed direct queries
- lightweight aggregation logic in app or function layer later if needed

Do not overengineer aggregation before MVP usage proves it necessary.

---

## Index Strategy Rules

### Rule 1
Index the collections with frequent filtered views first:
- leads
- deals
- tasks
- activities
- agentRuns

### Rule 2
Do not create speculative indexes for every possible future query.

### Rule 3
Treat Firestore index creation as part of core implementation, not cleanup work.

---

## Recommendation
Start with the lead, deal, task, activity, and agent run indexes above. Expand only when actual product queries require it.
