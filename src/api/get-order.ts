import type { Order } from '../domain/order.js';
import { isValidOrderNumber } from '../domain/order.js';

export interface OrderRepository {
  findByOrderNumber(orderNumber: string): Order | undefined;
}

export interface ApiResponse {
  status: 200 | 400 | 404;
  body: Order | { error: string };
}

/** Handler for GET /orders/{orderNumber}. */
export function getOrder(repo: OrderRepository, orderNumber: string): ApiResponse {
  if (!isValidOrderNumber(orderNumber)) {
    return { status: 400, body: { error: 'invalid order number' } };
  }
  const order = repo.findByOrderNumber(orderNumber);
  if (!order) {
    return { status: 404, body: { error: 'order not found' } };
  }
  return { status: 200, body: order };
}
