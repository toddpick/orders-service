# FEAT-112 Order confirmation emails — Tasks

Status: Approved
Owner (role): Business Analyst
Last updated: 2026-09-09

## Implementation tasks

| # | Task | Owner | Status |
|---|---|---|---|
| 1 | Publish status-change events for PACKED and later statuses | Orders team | Done |
| 2 | Notification worker with idempotency store | Orders team | Done |
| 3 | Email templates (text and HTML) for each status | Orders team | Done |
| 4 | Dead-letter queue and alerting | Orders team | Done |
| 5 | Signature notice for orders of $500.00 or more | Orders team | Done |

## Test plan

| # | Scenario | Type | Expected result |
|---|---|---|---|
| 1 | Order of $499.99 reaches `OUT_FOR_DELIVERY` | Unit | No signature notice |
| 2 | Order of $500.00 reaches `OUT_FOR_DELIVERY` | Unit | Signature notice present |
| 3 | Same event delivered twice | Integration | One email sent |
| 4 | Mail provider unavailable for 10 minutes | Integration | Email sent after recovery, no duplicates |
| 5 | Customer without phone number | Unit | Email rendered normally |
| 6 | Cancel an order in `PACKED` | Manual | `CANCELLED` email received |

## Risks and open items

| # | Risk or open item | Owner (role) | Status |
|---|---|---|---|
| 1 | Provider outage longer than 6 hours drops emails to the dead-letter queue | Cloud Architect | Accepted by G4 approvers |

## Gate G4 — Release sign-off

| Checked | Item |
|---|---|
| [x] | Test plan executed |
| [x] | Open risks resolved or explicitly accepted |
| [x] | Rollout and rollback described |

| Approver (role) | Status | Date | Conditions |
|---|---|---|---|
| Governance (TGO) | Approved | 2026-09-09 | |
| QA Lead | Approved | 2026-09-08 | |
