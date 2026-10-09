# INT-201 Delivery partner integration — Requirements

Status: Draft
Owner (role): Business Analyst
Last updated: 2026-10-08

## Problem statement

Hand packed orders to an external delivery partner and track them to delivery; today the warehouse books couriers by hand.

## Scope

In scope:

Out of scope:

## Business rules (Orders side, known so far)

1. Orders with `totalValueCents >= 50000` ($500.00 or more) require a signature on delivery.
2. An order can be cancelled until its status reaches `SHIPPED`.
3. The customer receives an email on every status change after `PACKED` (see FEAT-112).
4. An order is treated as one shipment (`shipmentId` is a single nullable string on the order).
5. Customers may choose `EVENING` delivery at checkout; the order carries `deliveryPreference`.
6. Items carry `handlingCodes`; `HAZMAT_CLASS_3` marks flammable liquids such as some cleaning products.

## Field mapping

| Source field | Target field | Type | Unit / format | Conversion | Owner |
|---|---|---|---|---|---|

## Status mapping

| Source status | Target status | Notes |
|---|---|---|

## Acceptance criteria

## Open questions

| # | Question | Owner (role) | Status |
|---|---|---|---|

## Gate G1 — Requirements

| Checked | Item |
|---|---|
| [ ] | Scope agreed |
| [ ] | Business rules listed and confirmed |
| [ ] | Acceptance criteria testable |

| Approver (role) | Status | Date | Conditions |
|---|---|---|---|
| Business Analyst | Pending | | |
| Solution Management | Pending | | |
