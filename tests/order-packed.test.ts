import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ORDER_PACKED_TOPIC, buildOrderPackedEvent } from '../src/events/order-packed.js';
import { makeOrder } from './fixtures.js';

const now = new Date('2026-10-05T09:48:13Z');
const eventId = '6f1c2d54-3b7a-4e0e-9c55-0d2a8f6b7e31';

describe('buildOrderPackedEvent', () => {
  it('matches the published sample', () => {
    const sample = JSON.parse(
      readFileSync(new URL('../samples/order-packed.event.json', import.meta.url), 'utf8'),
    );
    expect(buildOrderPackedEvent(makeOrder(), { eventId, now })).toEqual(sample);
  });

  it('uses the v1 topic and a UTC timestamp', () => {
    const event = buildOrderPackedEvent(makeOrder(), { now });
    expect(event.topic).toBe(ORDER_PACKED_TOPIC);
    expect(event.occurredAt).toBe('2026-10-05T09:48:13Z');
  });

  it('flags orders that need a signature', () => {
    const low = buildOrderPackedEvent(makeOrder({ totalValueCents: 4_999 }), { now });
    expect(low.payload.requiresSignature).toBe(false);
  });

  it('refuses orders that are not packed', () => {
    expect(() => buildOrderPackedEvent(makeOrder({ status: 'PICKING' }))).toThrow(/PICKING/);
  });
});
