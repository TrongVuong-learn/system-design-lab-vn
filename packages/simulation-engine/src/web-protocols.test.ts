import { it, expect } from 'vitest';
import { cookieSession, reverseProxy, multiplexLoss } from './web-protocols';
it('browser cookie and server session have separate lifecycles', () => {
  expect(cookieSession({ step: 3, modelVersion: 1 })).toMatchObject({
    cookie: 'S1',
    active: true,
    identity: 'An',
  });
  expect(cookieSession({ mode: 'drop', step: 3, modelVersion: 1 })).toMatchObject({
    cookie: null,
    active: true,
    identity: 'Khách',
  });
  expect(cookieSession({ mode: 'revoke', step: 3, modelVersion: 1 })).toMatchObject({
    cookie: 'S1',
    active: false,
    identity: 'Khách',
  });
  expect(cookieSession({ mode: 'revoke', step: 1, modelVersion: 1 }).active).toBe(true);
});
it('reverse proxy keeps one browser-facing host while selecting two backends', () => {
  for (const resource of ['class', 'image']) {
    expect(reverseProxy({ resource }).host).toBe('portal.example');
    expect(reverseProxy({ resource, mode: 'direct' }).host).toBe(
      resource === 'class' ? 'lich.example' : 'anh.example',
    );
    expect(reverseProxy({ resource, step: 3, modelVersion: 1 }).events).toHaveLength(3);
  }
});
it('isolates transport HOL example without claiming all HTTP3 work is independent', () => {
  for (const protocol of ['h2', 'h3'])
    for (const loss of [true, false]) {
      const s = multiplexLoss({ protocol, loss, step: 2, modelVersion: 1 });
      expect(s.bReceived).toBe(true);
      expect(s.aDelivered).toBe(!loss);
      expect(s.bDelivered).toBe(!loss || protocol === 'h3');
      expect(multiplexLoss({ protocol, loss, step: 3, modelVersion: 1 })).toMatchObject({
        aDelivered: true,
        bDelivered: true,
        finished: true,
      });
    }
});
it('does not accept imported counters or invalid checkpoints', () => {
  for (const simulate of [cookieSession, reverseProxy, multiplexLoss]) {
    for (const step of [-1, 4, 1.5, '3', Infinity])
      expect(simulate({ step, modelVersion: 1 }).step).toBe(0);
    expect(simulate({ step: 3, modelVersion: 2 }).step).toBe(0);
    const input = { step: 2, modelVersion: 1, identity: 'Admin', host: 'evil', bDelivered: true };
    const copy = structuredClone(input);
    simulate(input);
    expect(input).toEqual(copy);
  }
});
