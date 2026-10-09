# FEAT-112 Order confirmation emails — Design

Status: Approved
Owner (role): Cloud Architect
Last updated: 2026-08-26

## Overview

A notification worker subscribes to order status-change events on the internal message bus, renders the matching template and hands the message to the mail provider. The order service does not call the mail provider directly.

## Integration style

Options considered:

| Option | Pros | Cons |
|---|---|---|
| Synchronous call to the mail provider from the order service | Simple | A mail outage would block order processing |
| Event-driven worker (chosen) | Order processing is independent of mail availability; retries are isolated | Needs idempotency handling |

Decision: event-driven worker. Recorded as D-002 in `DECISIONS.md`.

## Data flow

1. Order service changes status and publishes a domain event (see `docs/events.md`).
2. Worker receives the event, looks up the order with `GET /orders/{orderNumber}`.
3. Worker renders the template and sends through the mail provider.
4. Worker records the `eventId` as processed.

## Data shared

| Data | Shared with | Purpose | PII | Retention |
|---|---|---|---|---|
| `customer.fullName`, `customer.email` | Mail provider | Address and greet the customer | Yes | 30 days at the provider |
| `orderNumber`, status, `promisedDeliveryDate` | Mail provider | Email body | No | 30 days at the provider |
| `customer.phone` | Not shared | | Yes | |

## Reliability and error handling

- Bus delivery is at-least-once. The worker stores processed `eventId` values for 7 days and skips duplicates (AC-4).
- Mail provider failures are retried with exponential backoff for up to 6 hours, then moved to a dead-letter queue and alerted on.
- Events for the same order may arrive out of order; the worker sends the email for the status in the event, not the current order status.

## Security

The worker uses a read-only service account for `GET /orders/{orderNumber}`. Mail provider credentials are held in the secrets store.

## Open items

None.

## Gate G2 — Design

| Checked | Item |
|---|---|
| [x] | Integration style chosen and justified |
| [x] | Failure modes and retries described |
| [x] | Error handling and monitoring described |

| Approver (role) | Status | Date | Conditions |
|---|---|---|---|
| Cloud Architect | Approved | 2026-08-19 | |

## Gate G3 — Data & governance

| Checked | Item |
|---|---|
| [x] | Data shared is listed with purpose |
| [x] | PII identified and minimised |
| [x] | Retention stated |

| Approver (role) | Status | Date | Conditions |
|---|---|---|---|
| Governance (TGO) | Approved with conditions | 2026-08-26 | No phone numbers or street addresses in email payloads sent to the provider |
