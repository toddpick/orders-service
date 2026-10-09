import { describe, expect, it } from 'vitest';
import { totalWeightLb } from '../src/domain/weights.js';
import { makeOrder } from './fixtures.js';

describe('totalWeightLb', () => {
  it('sums unit weight times quantity', () => {
    expect(totalWeightLb(makeOrder())).toBe(15);
  });
  it('is zero for an order with no items', () => {
    expect(totalWeightLb(makeOrder({ items: [] }))).toBe(0);
  });
  it('rounds to two decimal places', () => {
    const order = makeOrder();
    const [first] = order.items;
    order.items = [{ ...first!, quantity: 3, unitWeightLb: 0.333 }];
    expect(totalWeightLb(order)).toBe(1);
  });
});
