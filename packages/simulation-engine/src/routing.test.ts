import { expect, it } from 'vitest';
import { routePacket } from './routing';
it('forwards to a host before selecting its destination TCP service', () => {
  expect(routePacket('school', 8080, true, 0).outcome).toBe('ready');
  expect(routePacket('school', 8080, true, 1).outcome).toBe('forwarding');
  expect(routePacket('school', 8080, true, 2).outcome).toBe('at-host');
  expect(routePacket('school', 8080, true, 3).outcome).toBe('timetable');
  expect(routePacket('school', 9090, true, 3).outcome).toBe('library');
  expect(routePacket('school', 8181, true, 3).outcome).toBe('not-listening');
});
it('a port change cannot bypass missing routing or select a different IP host', () => {
  for (const port of [8080, 9090, 8181]) {
    expect(routePacket('school', port, false, 3)).toMatchObject({
      outcome: 'no-route',
      atHost: false,
      terminal: true,
    });
    expect(routePacket('other', port, true, 3)).toMatchObject({
      ip: '198.51.100.20',
      outcome: 'other-host',
    });
  }
});
it('restores malformed checkpoints to bounded deterministic inputs', () => {
  expect(routePacket('unknown', NaN, null, Infinity)).toMatchObject({
    ip: '192.0.2.10',
    destinationPort: 8080,
    phase: 0,
  });
  expect(routePacket('school', 8080, true, 100).phase).toBe(0);
  expect(routePacket('school', 8080, true, -5).phase).toBe(0);
  expect(routePacket('school', 8080, true, 1.5).phase).toBe(0);
});
