import { it, expect } from 'vitest';
import {
  initialCache,
  cacheStep,
  initialQueue,
  queueStep,
  observeCache,
  observeQueue,
  observeNetwork,
  parseObservation,
} from './index';
it('distinguishes cache expiry from reading and retains the last historical result', () => {
  let state = cacheStep(initialCache(), { type: 'read' });
  state = cacheStep(state, { type: 'update', value: 205 });
  for (let i = 0; i < 4; i++) state = cacheStep(state, { type: 'wait' });
  const expired = cacheStep(state, { type: 'wait' });
  const wait = observeCache(state, expired, { type: 'wait' });
  expect(wait.reason).toContain('chưa tự lấy nguồn');
  expect(expired.cached).toBe(201);
  const read = cacheStep(expired, { type: 'read' });
  expect(
    observeCache(expired, read, { type: 'read' }).rows.find((r) => r.label === 'Lần xem gần nhất'),
  ).toEqual({ label: 'Lần xem gần nhất', before: 'Phòng 201', after: 'Phòng 205' });
  expect(read.misses).toBe(1);
});
it('counts actual queue completions and does not invent a step on config change', () => {
  const zero = initialQueue(),
    first = queueStep(zero, 6, 1);
  expect(observeQueue(zero, first, 6, 1, 6, 1).reason).toContain('0 + 6 − 2 = 4');
  expect(observeQueue(first, first, 6, 4, 6, 1).reason).toContain('Chưa qua thêm giây');
  const cleared = queueStep(first, 0, 4);
  expect(observeQueue(first, cleared, 0, 4, 6, 4).reason).toContain('thực tế làm xong 4');
  expect(cleared.queued).toBe(0);
});
it('network comparison keeps RTT and processing fixed when doubling rate', () => {
  const o = observeNetwork({ rtt: 100, rate: 8, size: 1000 }, { rtt: 100, rate: 16, size: 1000 });
  expect(o.rows).toContainEqual({ label: 'Tổng lý tưởng', before: '1.150 ms', after: '650 ms' });
  expect(o.rows).toContainEqual({ label: 'Máy chủ xử lý', before: '50 ms', after: '50 ms' });
  expect(parseObservation(JSON.stringify(o))).toEqual(o);
  expect(parseObservation('{"rows":[null]}')).toBeNull();
  expect(parseObservation('broken')).toBeNull();
});
