# Data dictionary

Fields of the Order model as defined in `src/domain/order.ts`. All timestamps are ISO-8601 UTC with a trailing `Z`.

## Order

| Field | Type | Unit / format | Notes |
|---|---|---|---|
| `orderNumber` | string | `ORD-YYYY-NNNNNN` (15 characters) | e.g. `ORD-2026-004817`. Unique, immutable. |
| `status` | enum | see Statuses | |
| `createdAt` | string | UTC timestamp | |
| `paidAt` | string | UTC timestamp | Absent until paid |
| `packedAt` | string | UTC timestamp | Absent until packed |
| `customer` | object | | see Customer |
| `shipTo` | object | | see ShipTo |
| `items` | array | | see Item, at least one |
| `totalValueCents` | integer | US cents | $618.00 is `61800` |
| `currency` | string | `USD` | Only USD is supported |
| `promisedDeliveryDate` | string | `YYYY-MM-DD`, date only | Shown to the customer at checkout. No time of day. |
| `deliveryPreference` | enum | `STANDARD`, `EVENING` | Chosen by the customer at checkout |
| `shipmentId` | string or null | | One order is one shipment. Null until a shipment exists. |

## Customer

| Field | Type | Format | Notes |
|---|---|---|---|
| `fullName` | string | free text | |
| `email` | string | email address | |
| `phone` | string | E.164, e.g. `+15555550142` | Optional. May be missing. |

## ShipTo

| Field | Type | Format | Notes |
|---|---|---|---|
| `addressText` | string | free text, multi-line | Exactly as typed by the customer. Not parsed into parts. |
| `postalCode` | string | | |
| `countryCode` | string | ISO 3166-1 alpha-2 | |

## Item

| Field | Type | Unit | Notes |
|---|---|---|---|
| `sku` | string | | |
| `description` | string | | |
| `quantity` | integer | units | At least 1 |
| `unitWeightLb` | number | pounds, always | Weight of one unit |
| `dimensionsIn` | object `{l, w, h}` | inches | Of one unit, packed |
| `handlingCodes` | array of enum | | see Handling codes |

## Handling codes

| Code | Meaning |
|---|---|
| `FRAGILE` | Breakable; pack with protection |
| `PERISHABLE` | Time or temperature sensitive |
| `KEEP_UPRIGHT` | Must not be laid on its side |
| `HAZMAT_CLASS_3` | Flammable liquids, e.g. some cleaning products |
| `HIGH_VALUE` | Individually high value item |

## Statuses

| Status | Meaning |
|---|---|
| `PLACED` | Order created, not yet paid |
| `PAID` | Payment received |
| `PICKING` | Being picked in the warehouse |
| `PACKED` | Packed and ready to ship |
| `SHIPPED` | Left the warehouse |
| `OUT_FOR_DELIVERY` | On the final delivery run |
| `DELIVERED` | Delivered to the customer |
| `CANCELLED` | Cancelled (only possible before `SHIPPED`) |
| `RETURNED` | Returned after shipping |

## Derived values

| Value | Rule |
|---|---|
| Signature required | `totalValueCents >= 50000` |
| Can cancel | status is not `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED` or `RETURNED` |
| Total weight (lb) | sum of `unitWeightLb * quantity`, rounded to 2 decimals |
