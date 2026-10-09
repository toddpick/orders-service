import { randomUUID } from 'node:crypto';
import type { Customer, DeliveryPreference, Order, OrderItem, ShipTo } from '../domain/order.js';
import { requiresSignature } from '../domain/order.js';
import { totalWeightLb } from '../domain/weights.js';

export const ORDER_PACKED_TOPIC = 'orders.order-packed.v1';

export interface OrderPackedEvent {
  eventId: string;
  eventType: 'OrderPacked';
  topic: typeof ORDER_PACKED_TOPIC;
  /** UTC, ISO-8601 with Z. */
  occurredAt: string;
  payload: {
    orderNumber: string;
    packedAt: string;
    customer: Customer;
    shipTo: ShipTo;
    items: OrderItem[];
    totalWeightLb: number;
    totalValueCents: number;
    currency: 'USD';
    promisedDeliveryDate: string;
    deliveryPreference: DeliveryPreference;
    requiresSignature: boolean;
  };
}

export interface BuildOptions {
  eventId?: string;
  now?: Date;
}

/** ISO-8601 UTC with second precision, e.g. 2026-10-05T09:48:13Z. */
function toUtcSeconds(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export function buildOrderPackedEvent(order: Order, options: BuildOptions = {}): OrderPackedEvent {
  if (order.status !== 'PACKED') {
    throw new Error(`cannot publish OrderPacked for ${order.orderNumber} in status ${order.status}`);
  }
  if (!order.packedAt) {
    throw new Error(`order ${order.orderNumber} has no packedAt`);
  }
  return {
    eventId: options.eventId ?? randomUUID(),
    eventType: 'OrderPacked',
    topic: ORDER_PACKED_TOPIC,
    occurredAt: toUtcSeconds(options.now ?? new Date()),
    payload: {
      orderNumber: order.orderNumber,
      packedAt: order.packedAt,
      customer: order.customer,
      shipTo: order.shipTo,
      items: order.items,
      totalWeightLb: totalWeightLb(order),
      totalValueCents: order.totalValueCents,
      currency: order.currency,
      promisedDeliveryDate: order.promisedDeliveryDate,
      deliveryPreference: order.deliveryPreference,
      requiresSignature: requiresSignature(order),
    },
  };
}
