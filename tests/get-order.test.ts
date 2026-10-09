import { describe, expect, it } from 'vitest';
import { getOrder } from '../src/api/get-order.js';
import { makeOrder } from './fixtures.js';

const order = makeOrder();
const repo = {
  findByOrderNumber: (n: string) => (n === order.orderNumber ? order : undefined),
};

describe('getOrder', () => {
  it('returns the order when found', () => {
    expect(getOrder(repo, 'ORD-2026-004817')).toEqual({ status: 200, body: order });
  });
  it('returns 404 for an unknown order', () => {
    expect(getOrder(repo, 'ORD-2026-000001').status).toBe(404);
  });
  it('returns 400 for a malformed order number', () => {
    expect(getOrder(repo, '4817').status).toBe(400);
  });
});
