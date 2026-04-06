# Goals And Non-Goals

## Purpose
This document defines what ChromaOS CRM is supposed to achieve in version 1 and what it is explicitly not trying to become yet.

This is the guardrail document.

---

## Primary Goals

### 1. Unify Internal Sales Operations
Create one internal system where all leads, deals, tasks, and activities across Chromapages and sub-brands can be managed.

### 2. Support Multi-Brand Visibility
Allow the owner to see all activity across:
- Chromapages
- BuiltExpert
- ServeStrategy
without juggling disconnected systems.

### 3. Standardize Lead Routing
Make it easy to route leads into the correct brand pipeline based on fit, offer, and context.

### 4. Improve Follow-Up Discipline
Reduce missed follow-up by making tasks, next actions, and record history visible and structured.

### 5. Speed Up Sales And Handoffs
Use better data structure and AI-assisted actions to make proposal prep, qualification, and execution handoffs faster.

### 6. Create A Reliable System Of Record
Make the CRM the default internal place where the truth lives.

### 7. Support OpenClaw Agent Integration
Give agents clean record context so they can classify, summarize, recommend, and draft inside real workflows.

---

## Secondary Goals

### 1. Make Dashboards Operationally Useful
The dashboard should surface what actually needs attention.

### 2. Build A Clean Firebase Foundation
Design the data model well enough that the app can expand later without major rework.

### 3. Prepare For Future Team Growth
Build structure that future operators can use without relying on tribal knowledge.

---

## Non-Goals

### 1. Not A Public SaaS Product
This project is not trying to compete with HubSpot, Salesforce, or Pipedrive.

### 2. Not A Client Portal
Clients do not need access in MVP.

### 3. Not A Full Project Management Platform
This should not turn into Asana/ClickUp/Notion in disguise.

### 4. Not A Billing Platform
Invoices, subscriptions, and accounting are not the priority in version 1.

### 5. Not Full Inbox Or Calendar Sync
Those features add complexity and are not needed to prove the operational core.

### 6. Not An Automation Platform
The goal is structured data and usable workflows first, not building a workflow engine.

### 7. Not AI-Led Chaos
AI should assist the workflow, not replace the system of record or mutate important data automatically.

---

## Decision Filter
If a proposed feature does not clearly help:
- lead management
- deal tracking
- task management
- brand routing
- activity visibility
- AI-assisted next steps

then it is probably not a version 1 feature.\n