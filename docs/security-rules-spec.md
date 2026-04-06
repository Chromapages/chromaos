# Security Rules Spec

## Purpose
This document defines the behavioral requirements for Firestore security in ChromaOS CRM.

This is the security intent document. The actual Firebase rules file should implement these behaviors.

---

## Core Principle
ChromaOS CRM is an internal system.

That means:
- authenticated access only
- no public read/write
- internal operational data is protected
- admin-level config is more restricted
- destructive actions are tightly limited

---

## Authentication Requirement

### Rule
Only authenticated internal users can access CRM data.

### MVP Standard
- no anonymous access
- no public reads
- no public writes

---

## User Access Model

### MVP Roles
- admin
- operator

### Shared Requirement
Users must be:
- authenticated
- active
- present in the `users` collection

---

## Collection-Level Access Intent

## `users`
### Read
- internal authenticated users can read their own profile
- admins can read all user profiles

### Write
- admins manage users
- users may update limited self-profile fields later if desired

### Delete
- restricted

---

## `brands`
### Read
- internal authenticated users can read

### Write
- admin only

### Delete
- restricted

---

## `pipelines`
### Read
- internal authenticated users can read

### Write
- admin only

### Delete
- restricted

---

## `pipelineStages`
### Read
- internal authenticated users can read

### Write
- admin only

### Delete
- restricted

---

## `leads`
### Read
- internal authenticated users can read

### Write
- internal authenticated users can create/update

### Delete
- strongly restricted or disabled in MVP

---

## `companies`
### Read
- internal authenticated users can read

### Write
- internal authenticated users can create/update

### Delete
- restricted

---

## `contacts`
### Read
- internal authenticated users can read

### Write
- internal authenticated users can create/update

### Delete
- restricted

---

## `deals`
### Read
- internal authenticated users can read

### Write
- internal authenticated users can create/update

### Delete
- restricted

---

## `tasks`
### Read
- internal authenticated users can read

### Write
- internal authenticated users can create/update

### Delete
- restricted

---

## `activities`
### Read
- internal authenticated users can read

### Write
- internal authenticated users can create

### Update
- limited or admin-only

### Delete
- restricted

### Recommendation
Treat activities as timeline records, not casual mutable content.

---

## `agentRuns`
### Read
- internal authenticated users can read

### Write
- internal authenticated users can create

### Update
- limited or admin-only

### Delete
- restricted

### Recommendation
Treat agent outputs as important operational records.

---

## `templates`
### Read
- internal authenticated users can read

### Write
- admin or designated editor later
- admin only in MVP

### Delete
- restricted

---

## `settings`
### Read
- internal authenticated users can read

### Write
- admin only

### Delete
- restricted

---

## Ownership vs Access
In MVP, ownership should mainly support workflow, not strict visibility control.

That means:
- owner assignment helps operations
- but internal users do not need hard brand-based visibility restrictions yet

Keep it simple until the workflow proves otherwise.

---

## Delete Policy
### Recommendation
Avoid hard deletes on important CRM collections in MVP.

Better options:
- disable delete from client
- add `status` or archive flow later
- restrict deletes to admin if absolutely necessary

---

## AI Security Guidance
AI actions should:
- read only the record context they need
- store outputs explicitly
- not auto-mutate critical record state in MVP without human review

---

## MVP Recommendation
The minimum safe security posture is:

1. unauthenticated users can do nothing
2. only active internal users can access operational collections
3. admin-only configuration collections stay protected
4. deletes are restricted
5. AI outputs and activity logs are treated as real business records, not disposable output
