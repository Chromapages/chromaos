# Firestore Schema

## Purpose
This document defines the recommended Firestore collection structure for ChromaOS CRM.

The goal is to support:
- cross-brand visibility
- fast operational queries
- predictable record relationships
- AI logging
- MVP simplicity

---

## Top-Level Collections

Use the following top-level collections:

- `users`
- `brands`
- `pipelines`
- `pipelineStages`
- `leads`
- `companies`
- `contacts`
- `deals`
- `tasks`
- `activities`
- `agentRuns`
- `templates`
- `settings`

---

## Why Top-Level Collections
Top-level collections are preferred in MVP because:
- records need to be queryable across brands
- dashboard queries are easier
- table views are easier
- record relationships are simpler to reason about
- AI actions need unified access to operational records

Avoid deep subcollections unless a proven use case emerges.

---

## Collection Shapes

## `users/{userId}`
```json
{
  "fullName": "",
  "email": "",
  "role": "admin",
  "isActive": true,
  "defaultBrandId": "",
  "createdAt": "",
  "updatedAt": ""
}
```

## `brands/{brandId}`
```json
{
  "name": "",
  "slug": "",
  "parentBrandId": "",
  "isActive": true,
  "defaultPipelineId": "",
  "createdAt": "",
  "updatedAt": ""
}
```

## `pipelines/{pipelineId}`
```json
{
  "brandId": "",
  "name": "",
  "slug": "",
  "isDefault": true,
  "stageIds": [],
  "createdAt": "",
  "updatedAt": ""
}
```

## `pipelineStages/{stageId}`
```json
{
  "pipelineId": "",
  "name": "",
  "slug": "",
  "order": 1,
  "color": "",
  "isClosedWon": false,
  "isClosedLost": false,
  "createdAt": "",
  "updatedAt": ""
}
```

## `leads/{leadId}`
```json
{
  "fullName": "",
  "companyName": "",
  "email": "",
  "phone": "",
  "website": "",
  "source": "",
  "sourceDetail": "",
  "brandId": "",
  "pipelineId": "",
  "stageId": "",
  "ownerUserId": "",
  "offerInterest": "",
  "tradeOrVertical": "",
  "budgetRange": "",
  "timeline": "",
  "leadScore": 0,
  "fitScore": 0,
  "nextAction": "",
  "notesSummary": "",
  "status": "active",
  "companyId": "",
  "createdAt": "",
  "updatedAt": ""
}
```

## `companies/{companyId}`
```json
{
  "name": "",
  "website": "",
  "tradeOrIndustry": "",
  "region": "",
  "brandContext": [],
  "primaryContactId": "",
  "ownerUserId": "",
  "status": "active",
  "totalValue": 0,
  "notesSummary": "",
  "createdAt": "",
  "updatedAt": ""
}
```

## `contacts/{contactId}`
```json
{
  "companyId": "",
  "fullName": "",
  "email": "",
  "phone": "",
  "role": "",
  "notesSummary": "",
  "createdAt": "",
  "updatedAt": ""
}
```

## `deals/{dealId}`
```json
{
  "leadId": "",
  "companyId": "",
  "brandId": "",
  "pipelineId": "",
  "stageId": "",
  "offerName": "",
  "amount": 0,
  "billingType": "",
  "status": "open",
  "closeProbability": 0,
  "ownerUserId": "",
  "notesSummary": "",
  "createdAt": "",
  "updatedAt": ""
}
```

## `tasks/{taskId}`
```json
{
  "linkedEntityType": "lead",
  "linkedEntityId": "",
  "title": "",
  "description": "",
  "ownerUserId": "",
  "dueDate": "",
  "priority": "medium",
  "status": "open",
  "createdAt": "",
  "updatedAt": ""
}
```

## `activities/{activityId}`
```json
{
  "linkedEntityType": "lead",
  "linkedEntityId": "",
  "activityType": "note",
  "title": "",
  "note": "",
  "createdByUserId": "",
  "createdAt": ""
}
```

## `agentRuns/{agentRunId}`
```json
{
  "linkedEntityType": "lead",
  "linkedEntityId": "",
  "agentName": "chroma",
  "actionType": "classify_lead",
  "inputSummary": "",
  "output": "",
  "createdByUserId": "",
  "createdAt": ""
}
```

## `templates/{templateId}`
```json
{
  "type": "proposal",
  "name": "",
  "content": "",
  "isActive": true,
  "createdAt": "",
  "updatedAt": ""
}
```

## `settings/{settingId}`
```json
{
  "name": "",
  "value": {},
  "updatedAt": ""
}
```

---

## Linking Strategy
Use reference IDs rather than deeply nested documents.

Examples:
- `lead.companyId`
- `deal.leadId`
- `deal.companyId`
- `task.linkedEntityType`
- `task.linkedEntityId`

---

## Query Principles
1. Leads must be queryable by brand, stage, owner, and source.
2. Deals must be queryable by brand and stage.
3. Tasks must be queryable by owner, status, and due date.
4. Activities must be queryable by linked entity.
5. Agent runs must be queryable by linked entity and agent.
