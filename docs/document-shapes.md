# Document Shapes

## Purpose
This document defines the practical Firestore document shapes and required field expectations for ChromaOS CRM.

This is the implementation-facing version of the model layer.

---

## Shared Field Conventions

### Timestamp Fields
Use:
- `createdAt`
- `updatedAt`

### ID References
Use string IDs consistently for:
- `brandId`
- `pipelineId`
- `stageId`
- `ownerUserId`
- `companyId`
- `leadId`
- `dealId`

### Status Fields
Use explicit string values instead of vague booleans when appropriate.

---

## `users` Document Shape

```json
{
  "fullName": "Eric Black",
  "email": "eric@example.com",
  "role": "admin",
  "isActive": true,
  "defaultBrandId": "chromapages",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Required:
- fullName
- email
- role
- isActive

---

## `brands` Document Shape

```json
{
  "name": "BuiltExpert",
  "slug": "builtexpert",
  "parentBrandId": "chromapages",
  "isActive": true,
  "defaultPipelineId": "builtexpert-default",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Required:
- name
- slug
- isActive

---

## `pipelines` Document Shape

```json
{
  "brandId": "builtexpert",
  "name": "BuiltExpert Default Pipeline",
  "slug": "builtexpert-default",
  "isDefault": true,
  "stageIds": [
    "new-lead",
    "audit-lead",
    "audit-purchased"
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Required:
- brandId
- name
- slug
- isDefault

---

## `pipelineStages` Document Shape

```json
{
  "pipelineId": "builtexpert-default",
  "name": "Audit Purchased",
  "slug": "audit-purchased",
  "order": 3,
  "color": "amber",
  "isClosedWon": false,
  "isClosedLost": false,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Required:
- pipelineId
- name
- slug
- order

---

## `leads` Document Shape

```json
{
  "fullName": "Jane Doe",
  "companyName": "Doe HVAC",
  "email": "jane@doehvac.com",
  "phone": "555-555-5555",
  "website": "https://doehvac.com",
  "source": "website",
  "sourceDetail": "BuiltExpert contact form",
  "brandId": "builtexpert",
  "pipelineId": "builtexpert-default",
  "stageId": "new-lead",
  "ownerUserId": "user_1",
  "offerInterest": "Lead System Audit",
  "tradeOrVertical": "HVAC",
  "budgetRange": "$5k-$10k",
  "timeline": "Within 30 days",
  "leadScore": 78,
  "fitScore": 85,
  "nextAction": "Book discovery call",
  "notesSummary": "Needs stronger website and local visibility",
  "status": "active",
  "companyId": "company_1",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Required:
- fullName
- brandId
- pipelineId
- stageId
- status
- createdAt
- updatedAt

---

## `companies` Document Shape

```json
{
  "name": "Doe HVAC",
  "website": "https://doehvac.com",
  "tradeOrIndustry": "HVAC",
  "region": "Southern California",
  "brandContext": ["builtexpert"],
  "primaryContactId": "contact_1",
  "ownerUserId": "user_1",
  "status": "active",
  "totalValue": 6800,
  "notesSummary": "Potential website + SEO client",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Required:
- name
- status
- createdAt
- updatedAt

---

## `contacts` Document Shape

```json
{
  "companyId": "company_1",
  "fullName": "Jane Doe",
  "email": "jane@doehvac.com",
  "phone": "555-555-5555",
  "role": "Owner",
  "notesSummary": "Main decision maker",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Required:
- companyId
- fullName
- createdAt
- updatedAt

---

## `deals` Document Shape

```json
{
  "leadId": "lead_1",
  "companyId": "company_1",
  "brandId": "builtexpert",
  "pipelineId": "builtexpert-default",
  "stageId": "proposal-sent",
  "offerName": "Contractor Websites - Growth",
  "amount": 6800,
  "billingType": "one_time",
  "status": "open",
  "closeProbability": 70,
  "ownerUserId": "user_1",
  "notesSummary": "Proposal sent, follow up in 3 days",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Required:
- brandId
- pipelineId
- stageId
- offerName
- amount
- status
- createdAt
- updatedAt

---

## `tasks` Document Shape

```json
{
  "linkedEntityType": "lead",
  "linkedEntityId": "lead_1",
  "title": "Follow up after proposal",
  "description": "Send check-in email in 3 days",
  "ownerUserId": "user_1",
  "dueDate": "timestamp",
  "priority": "high",
  "status": "open",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Required:
- linkedEntityType
- linkedEntityId
- title
- ownerUserId
- status
- createdAt
- updatedAt

---

## `activities` Document Shape

```json
{
  "linkedEntityType": "lead",
  "linkedEntityId": "lead_1",
  "activityType": "proposal",
  "title": "Proposal sent",
  "note": "Sent proposal for BuiltExpert Growth Website package",
  "createdByUserId": "user_1",
  "createdAt": "timestamp"
}
```

Required:
- linkedEntityType
- linkedEntityId
- activityType
- title
- createdByUserId
- createdAt

---

## `agentRuns` Document Shape

```json
{
  "linkedEntityType": "lead",
  "linkedEntityId": "lead_1",
  "agentName": "chroma",
  "actionType": "recommend_next_step",
  "inputSummary": "BuiltExpert HVAC lead, website weak, likely audit or website fit",
  "output": "Recommend Lead System Audit first, then route to website proposal",
  "createdByUserId": "user_1",
  "createdAt": "timestamp"
}
```

Required:
- linkedEntityType
- linkedEntityId
- agentName
- actionType
- output
- createdAt

---

## `templates` Document Shape

```json
{
  "type": "proposal",
  "name": "BuiltExpert Website Proposal Base",
  "content": "Template content here",
  "isActive": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Required:
- type
- name
- content
- isActive

---

## Recommendation
Keep shapes strict enough to be predictable, but not so strict that every record edit becomes painful.
