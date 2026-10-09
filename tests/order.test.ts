import { describe, expect, it } from 'vitest';
import {
  ORDER_STATUSES,
  canCancel,
  isValidOrderNumber,
  requiresSignature,
} from '../src/domain/order.js';

describe('requiresSignature', () => {
  it('is false just below $500', () => {
    expect(requiresSignature({ totalValueCents: 49_999 })).toBe(false);
  });
  it('is true at exactly $500', () => {
    expect(requiresSignature({ totalValueCents: 50_000 })).toBe(true);
  });
  it('is true above $500', () => {
    expect(requiresSignature({ totalValueCents: 61_800 })).toBe(true);
  });
});

describe('canCancel', () => {
  it.each(['PLACED', 'PAID', 'PICKING', 'PACKED'] as const)('allows %s', (status) => {
    expect(canCancel({ status })).toBe(true);
  });
  it.each(['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'] as const)(
    'rejects %s',
    (status) => {
      expect(canCancel({ status })).toBe(false);
    },
  );
  it('covers every status', () => {
    expect(ORDER_STATUSES).toHaveLength(9);
  });
});

describe('isValidOrderNumber', () => {
  it('accepts the ORD-YYYY-NNNNNN format', () => {
    expect(isValidOrderNumber('ORD-2026-004817')).toBe(true);
    expect('ORD-2026-004817').toHaveLength(15);
  });
  it('rejects other shapes', () => {
    expect(isValidOrderNumber('ORD-26-4817')).toBe(false);
    expect(isValidOrderNumber('ord-2026-004817')).toBe(false);
  });
});
