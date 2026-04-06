# ChromaOS CRM

## Overview
ChromaOS CRM is the internal unified CRM and operating system for Chromapages and its sub-brands, including BuiltExpert and ServeStrategy. It is designed to centralize leads, companies, contacts, deals, tasks, activities, and AI-assisted actions in one internal system.

This is not a public SaaS product. It is an internal operating tool built to help manage multiple brands without fragmented workflows, scattered notes, or inconsistent follow-up.

## Purpose
The system exists to give one clear source of truth for:
- all inbound and outbound leads
- all brand-specific pipelines
- all company and contact records
- all deal/opportunity tracking
- all tasks and next actions
- all activity history
- all AI-agent-assisted recommendations and outputs

## Why This Exists
As Chromapages expands into multiple vertical brands, operational complexity increases fast. Without a unified CRM, the business risks:
- losing visibility across brands
- missing follow-ups
- duplicating work
- routing leads incorrectly
- slowing down proposal and fulfillment handoffs
- relying too much on memory

ChromaOS CRM solves that by creating one internal system for sales and operational flow.

## Core Principle
ChromaOS CRM should be:
- internal
- practical
- multi-brand
- Firebase-native
- fast to use
- easy to extend
- AI-assisted but not AI-dependent

It should not try to become a bloated all-in-one platform in version 1.

## Brands In Scope
At minimum, the CRM must support:
- Chromapages
- BuiltExpert
- ServeStrategy

The architecture should allow future sub-brands to be added without rebuilding the system.

## Primary Users
- Eric / owner-operator
- future internal operators
- future team members
- OpenClaw agents acting on structured records

## Core Modules For MVP
- Dashboard
- Leads
- Companies
- Contacts
- Deals
- Tasks
- Activities
- Pipelines
- AI Actions
- Settings

## Recommended Stack
- Next.js
- TypeScript
- Tailwind CSS
- Firebase Auth
- Cloud Firestore
- Firebase Storage
- Firebase Functions only where needed
- shadcn/ui
- TanStack Table

## Success Definition
Version 1 is successful when:
- all leads across brands are visible in one system
- each lead can be routed to the correct brand pipeline
- deals, tasks, and activities are easy to track
- AI actions can be triggered from records
- the CRM becomes the default internal place to manage sales and next steps\n