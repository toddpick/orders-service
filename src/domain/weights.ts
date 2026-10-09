import type { Order } from './order.js';

/** Total shipped weight of an order in pounds, rounded to 2 decimal places. */
export function totalWeightLb(order: Pick<Order, 'items'>): number {
  const total = order.items.reduce(
    (sum, item) => sum + item.unitWeightLb * item.quantity,
    0,
  );
  return Math.round(total * 100) / 100;
}
