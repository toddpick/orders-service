# orders-service

Order management for the Orders team: the order model, catalog import, domain events and a small internal read API.

## Layout

| Path | Contents |
|---|---|
| `src/domain/` | Order types, statuses, business rules, weight calculation |
| `src/catalog/` | Supplier catalog import |
| `src/events/` | Domain event builders |
| `src/api/` | Read API handler |
| `tests/` | Unit tests (vitest) |
| `docs/` | Data dictionary, events and API contract |
| `samples/` | Example orders, events and a supplier catalog file |
| `specs/` | Spec-driven development: requirements, design, tasks, gates |
| `DECISIONS.md` | Decision owners, gate approvers, decision log |

## Getting started

Requires Node 22.

```
npm install
npm test
npm run typecheck
```

## How we work

Changes start as a spec in `specs/` and pass four gates (requirements, design, data and governance, release sign-off). See `specs/README.md` and `DECISIONS.md`.

Current work:
- FEAT-112 Order confirmation emails: released.
- INT-201 Delivery partner: draft. An integration with an external delivery partner is planned.

Sample code for integration exercises. All data is fictional.
