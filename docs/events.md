# Events and read API

The Orders service publishes domain events on the internal message bus and offers a small internal read API. This is the whole of the integration surface today.

## Message bus

- Topics are named `orders.<event-name>.v<version>`.
- Messages are JSON.
- Delivery is at-least-once. Consumers must tolerate duplicates; use `eventId` to de-duplicate.
- Ordering is not guaranteed across topics.

### Envelope

| Field | Type | Notes |
|---|---|---|
| `eventId` | string (UUID) | Unique per event; stable across redeliveries |
| `eventType` | string | e.g. `OrderPacked` |
| `topic` | string | e.g. `orders.order-packed.v1` |
| `occurredAt` | string | ISO-8601 UTC with `Z`, second precision |
| `payload` | object | Event specific |

### Topics

| Topic | Published when |
|---|---|
| `orders.order-packed.v1` | Order reaches `PACKED` |
| `orders.order-cancelled.v1` | Order reaches `CANCELLED` |

### `orders.order-packed.v1` payload

| Field | Type | Notes |
|---|---|---|
| `orderNumber` | string | |
| `packedAt` | string | UTC timestamp |
| `customer` | object | `fullName`, `email`, optional `phone` |
| `shipTo` | object | `addressText`, `postalCode`, `countryCode` |
| `items` | array | As in the data dictionary |
| `totalWeightLb` | number | Pounds |
| `totalValueCents` | integer | |
| `currency` | string | `USD` |
| `promisedDeliveryDate` | string | `YYYY-MM-DD` |
| `deliveryPreference` | string | `STANDARD` or `EVENING` |
| `requiresSignature` | boolean | True when `totalValueCents >= 50000` |

A full example is in `samples/order-packed.event.json`. The builder is `src/events/order-packed.ts`.

### `orders.order-cancelled.v1` payload

| Field | Type | Notes |
|---|---|---|
| `orderNumber` | string | |
| `cancelledAt` | string | UTC timestamp |
| `statusBeforeCancel` | string | Order status when cancelled |

## Read API

`GET /orders/{orderNumber}`

| Response | Meaning |
|---|---|
| 200 | Body is the Order as described in `docs/data-dictionary.md` |
| 400 | `orderNumber` is not in the `ORD-YYYY-NNNNNN` format |
| 404 | No such order |

The API is internal, read-only and available inside the company network only. Handler: `src/api/get-order.ts`.
