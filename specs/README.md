# Specs

The Orders team works spec-first. Every feature or integration gets a folder under `specs/` and moves through three documents and four gates before code is released.

```
specs/
  _templates/                          requirements.md, design.md, tasks.md
  FEAT-112-order-confirmation-emails/  approved, shipped
  INT-201-delivery-partner/            draft, in progress
```

## Process

1. **Requirements** (`requirements.md`): the problem, scope, business rules, acceptance criteria.
2. **Design** (`design.md`): how it will work, integration style, data shared, error handling.
3. **Tasks** (`tasks.md`): the implementation steps and the test plan.

Copy the three files from `_templates/` into a new folder named `<ID>-<short-name>`. Set the `Status` at the top of each file. Gate status lives in the gate table at the bottom of each document and is summarised in `DECISIONS.md`.

## Gates

| Gate | Name | Approver (role) | What it checks |
|---|---|---|---|
| G1 | Requirements | Business Analyst + Solution Management | Scope, business rules, acceptance criteria |
| G2 | Design | Cloud Architect | Integration style (sync API vs events/queue), reliability, error handling |
| G3 | Data & governance | Governance (TGO) | What data is shared with whom, PII, retention |
| G4 | Release sign-off | Governance (TGO) + QA Lead | Test plan, open risks accepted, final approval |

Gate status values: `Not started`, `Pending`, `Approved`, `Approved with conditions`, `Rejected`.

Gates are passed in order. A later gate may be prepared while an earlier one is pending, but it is not signed until the earlier gate is approved.

## Open items

Items that cannot be resolved while drafting are recorded as `Open — owner: <role>`. They do not block drafting. G4 requires each open item to be either resolved or explicitly accepted by the G4 approvers.

## Decisions

Decisions that belong to a role (business rules, architecture, governance) are recorded in `DECISIONS.md` with the owner, the date and the gate they relate to. Engineers and agents propose options with a recommendation; the role decides.

## Status values for a spec

`Draft` -> `In review` -> `Approved` -> `Implemented`.
