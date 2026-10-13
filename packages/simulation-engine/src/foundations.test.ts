import { it, expect } from 'vitest';
import {
  measureBatch,
  estimateCapacity,
  initialDns,
  restoreDns,
  dnsStep,
  transferPackets,
} from './index';
it('separates tail latency from median and measures a declared batch window', () => {
  expect(measureBatch(1, false)).toMatchObject({
    windowMs: 2000,
    median: 1050,
    p95: 1900,
    throughput: 10,
  });
  const fast = measureBatch(2, false),
    slow = measureBatch(2, true);
  expect(fast).toMatchObject({ median: 550, p95: 1000, throughput: 20 });
  expect(slow).toMatchObject({ median: 550, p95: 1900, windowMs: 1900 });
  expect(slow.throughput).toBeCloseTo(20 / 1.9);
  expect(measureBatch(NaN, false).requests).toHaveLength(20);
});
it('keeps DNS stale until a lookup at the exact expiry boundary', () => {
  let state = dnsStep(initialDns(), 'lookup');
  state = dnsStep(state, 'move');
  for (let i = 0; i < 4; i++) state = dnsStep(state, 'wait');
  state = dnsStep(state, 'lookup');
  expect(state).toMatchObject({ last: 10, source: 20, route: 'cache', expiresAt: 5 });
  state = dnsStep(state, 'wait');
  expect(state.last).toBe(10);
  state = dnsStep(state, 'lookup');
  expect(state).toMatchObject({ last: 20, route: 'authoritative', expiresAt: 10 });
  expect(restoreDns({ ...state })).toEqual(state);
  expect(restoreDns({ time: 'bad' })).toEqual(initialDns());
  expect(restoreDns({ expiresAt: 900 })).toEqual(initialDns());
});
it('holds out-of-order TCP bytes but does not invent UDP retransmission', () => {
  expect(transferPackets('tcp', true, 2)).toEqual({
    received: [1, 3],
    delivered: [1],
    buffered: 1,
    retransmissions: 0,
  });
  expect(transferPackets('tcp', true, 3)).toMatchObject({
    delivered: [1, 2, 3],
    buffered: 0,
    retransmissions: 1,
  });
  expect(transferPackets('udp', true, 3)).toMatchObject({ delivered: [1, 3], retransmissions: 0 });
  expect(transferPackets('udp', false, 2).delivered).toEqual([1, 2, 3]);
});
it('separates daily transfer from unique storage and uses decimal units', () => {
  const r = estimateCapacity(2000, 5, 100, 4);
  expect(r).toMatchObject({ daily: 10000, transferMB: 1000, storageMB: 200 });
  expect(r.averageRps).toBeCloseTo(10000 / 86400);
  expect(r.peakRps).toBeCloseTo(r.averageRps * 4);
  const more = estimateCapacity(2000, 10, 100, 4);
  expect(more.storageMB).toBe(r.storageMB);
  expect(more.transferMB).toBe(2 * r.transferMB);
});
