# Scope

## Project Name
ChromaOS CRM

## Scope Summary
This document defines what is included in ChromaOS CRM MVP, what is excluded, and what constraints should keep the build focused.

The purpose is to prevent this project from expanding into a full CRM/SaaS platform before the internal operational core is proven.

## In Scope

### Core Records
- users
- brands
- pipelines
- pipeline stages
- leads
- companies
- contacts
- deals
- tasks
- activities
- agent runs
- templates
- settings

### Core Interfaces
- login
- dashboard
- leads table
- lead detail page
- companies table
- company detail page
- contacts table
- deals table
- deal detail page
- tasks view
- pipelines view
- brand pipeline view
- AI actions panel
- basic settings pages

### Core Functions
- create and update leads
- assign brand and pipeline
- move records through stages
- create and update deals
- create and complete tasks
- add activity log entries
- link leads to companies and deals
- filter records by brand, stage, owner, offer, and source
- trigger and store AI-assisted actions

### Firebase Scope
- Firebase Auth
- Cloud Firestore
- Firebase Storage if needed
- Firebase Functions only when necessary

## Out Of Scope For MVP

### Not Included
- public CRM features
- client portal
- invoicing/billing engine
- full email sync
- calendar sync
- advanced notification engine
- deep permissions matrix
- automation builder
- full project management platform
- robust reporting suite
- SaaS subscription/multi-tenant logic

### Also Out Of Scope
- replacing every other tool immediately
- building an external product for sale
- overengineering the internal app before the workflow is proven

## Constraints
- Firebase only
- must ship fast
- data model must stay predictable
- UI should prioritize clarity and speed
- brand-specific pipelines must exist inside one shared system
- AI must be layered onto structured data, not replace it

## Assumptions
- this is an internal app
- Eric is the primary operator in v1
- more brands may be added later
- OpenClaw agents will act as assistants, not autonomous operators
- the CRM must support multiple brands without becoming multiple separate apps

## Risks
- trying to build too much
- poor Firestore structure causing data sprawl
- unclear pipeline rules between brands
- mixing CRM and project management too early
- letting AI outputs become messy and unstructured

## Scope Control Question
When deciding whether something belongs in MVP, ask:

**Does this directly help manage leads, deals, tasks, routing, or AI-assisted next steps across brands right now?**

If not, it probably does not belong in version 1.\n