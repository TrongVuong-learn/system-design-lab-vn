import { it, expect } from 'vitest';
import { simulateTls, normalizeTls, observeTls } from './tls';
it('checks all channel/certificate/attack combinations without delivering tampered TLS data', () => {
  for (const secure of [false, true])
    for (const certificate of ['valid', 'wrong-name', 'expired', 'untrusted'])
      for (const attack of ['none', 'listen', 'tamper']) {
        const config = { secure, certificate, attack };
        const r = simulateTls(config);
        expect(r).toEqual(simulateTls(config));
        expect(r.sent).toBe(!secure || certificate === 'valid');
        if (secure && certificate !== 'valid') {
          expect(r.browser).toBe('Chưa có lịch');
          expect(r.trace).toHaveLength(3);
        } else if (secure && attack === 'tamper') {
          expect(r.rejected).toBe(true);
          expect(r.browser).not.toContain('999');
        } else expect(r.browser).toContain(!secure && attack === 'tamper' ? '999' : '201');
        if (secure) expect(r.observer).not.toContain('Phòng 201');
      }
});
it('defaults invalid checkpoint fields and does not pretend a configuration change sent HTTP', () => {
  expect(normalizeTls({ secure: 'false', certificate: 'bad', attack: 'script' })).toEqual({
    secure: true,
    certificate: 'valid',
    attack: 'none',
  });
  const before = simulateTls({}, false);
  expect(before.sent).toBe(false);
  const after = simulateTls({});
  expect(observeTls(before, after).rows[2]).toEqual({
    label: 'HTTP được gửi',
    before: 'Chưa',
    after: 'Có',
  });
});
