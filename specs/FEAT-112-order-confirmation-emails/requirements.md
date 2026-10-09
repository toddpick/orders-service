# FEAT-112 Order confirmation emails — Requirements

Status: Approved
Owner (role): Business Analyst
Last updated: 2026-08-12

## Problem statement

Customers currently learn about their order only by logging in. They want an email when the order is confirmed and whenever its status changes, so they do not have to check.

## Scope

In scope:
- An email to the customer when an order is placed and paid.
- An email on every status change after `PACKED` (`SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`, `RETURNED`).
- Plain-text and HTML versions of each email.

Out of scope:
- SMS or push notifications.
- Marketing content in the emails.
- Customer-configurable notification preferences (separate request).

## Business rules

1. The email goes to `customer.email` on the order.
2. One email per status change. Repeated delivery of the same change must not produce a second email.
3. Orders with `totalValueCents >= 50000` ($500.00 or more) require a signature on delivery. The `OUT_FOR_DELIVERY` email says so.
4. An order can be cancelled until its status reaches `SHIPPED`. The `CANCELLED` email states the refund will follow in 5 business days.
5. The email shows `promisedDeliveryDate` as a date only, with no time of day.

## Acceptance criteria

- AC-1: Placing and paying for an order sends one confirmation email within 2 minutes.
- AC-2: Moving an order to `SHIPPED` sends one email containing the order number and promised delivery date.
- AC-3: An `OUT_FOR_DELIVERY` email for an order of $500.00 or more contains the signature notice; an order of $499.99 does not.
- AC-4: Re-processing the same status-change event does not send a second email.
- AC-5: A customer with no phone number on file receives the same emails as any other customer.

## Open questions

None.

## Gate G1 — Requirements

| Checked | Item |
|---|---|
| [x] | Scope agreed |
| [x] | Business rules listed and confirmed |
| [x] | Acceptance criteria testable |

| Approver (role) | Status | Date | Conditions |
|---|---|---|---|
| Business Analyst | Approved | 2026-08-12 | |
| Solution Management | Approved | 2026-08-12 | |
