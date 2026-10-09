# Decisions

## Who decides what

| Area | Decision owner (role) | Examples |
|---|---|---|
| Scope, business rules, acceptance criteria | Business Analyst, with Solution Management | Signature threshold, cancellation rules, customer notifications |
| Architecture and integration style | Cloud Architect | Events vs synchronous API, retries, ordering, idempotency |
| Data sharing, PII, retention | Governance (TGO) | Which customer fields leave the Orders service, how long they are kept |
| Test plan and release | QA Lead, with Governance (TGO) | Entry/exit criteria, accepting open risks |
| Code structure inside this repo | Orders team engineers | Module layout, libraries, internal naming |

If a question does not clearly belong to the Orders team engineers, ask the owning role rather than deciding it in code.

## Gates

| Gate | Name | Approver (role) | What it checks |
|---|---|---|---|
| G1 | Requirements | Business Analyst + Solution Management | Scope, business rules, acceptance criteria |
| G2 | Design | Cloud Architect | Integration style (sync API vs events/queue), reliability, error handling |
| G3 | Data & governance | Governance (TGO) | What data is shared with whom, PII, retention |
| G4 | Release sign-off | Governance (TGO) + QA Lead | Test plan, open risks accepted, final approval |

Gate status values: `Not started`, `Pending`, `Approved`, `Approved with conditions`, `Rejected`.

Open items that cannot be resolved are recorded as `Open — owner: <role>`. They do not block drafting, but G4 needs each one either resolved or explicitly accepted.

## Gate status by spec

| Spec | G1 | G2 | G3 | G4 |
|---|---|---|---|---|
| FEAT-112 Order confirmation emails | Approved (2026-08-12) | Approved (2026-08-19) | Approved (2026-08-26) | Approved (2026-09-09) |
| INT-201 Delivery partner | Pending | Not started | Not started | Not started |

## Decision log

| ID | Date | Spec | Decision | Owner (role) | Gate | Notes |
|---|---|---|---|---|---|---|
| D-001 | 2026-08-12 | FEAT-112 | Send an email on every status change after PACKED | Business Analyst | G1 | |
| D-002 | 2026-08-19 | FEAT-112 | Email sending is asynchronous, driven by status-change events | Cloud Architect | G2 | |
| D-003 | 2026-08-26 | FEAT-112 | Customer email and name may be passed to the mail provider; retention 30 days | Governance (TGO) | G3 | Condition: no phone numbers in email payloads |
| | | | | | | |
