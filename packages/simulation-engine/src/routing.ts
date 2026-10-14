import { boundedNumber } from './index';

/** Fixed routes, TCP destination ports; no network I/O, NAT, firewall or handshake. */
export function routePacket(destination: unknown, port: unknown, route: unknown, step: unknown) {
  const ip = destination === 'other' ? '198.51.100.20' : '192.0.2.10';
  const destinationPort = port === 9090 || port === 8181 ? port : 8080;
  const hasRoute = route !== false;
  const phase = Math.trunc(boundedNumber(step, 0, 0, 3));
  const atRouter = phase >= 1;
  const atHost = phase >= 2 && hasRoute;
  const outcome = !atRouter
    ? 'ready'
    : !hasRoute
      ? 'no-route'
      : !atHost
        ? 'forwarding'
        : destination === 'other'
          ? 'other-host'
          : phase < 3
            ? 'at-host'
            : destinationPort === 8181
              ? 'not-listening'
              : destinationPort === 9090
                ? 'library'
                : 'timetable';
  const terminal = ['no-route', 'other-host', 'not-listening', 'library', 'timetable'].includes(
    outcome,
  );
  return { ip, destinationPort, hasRoute, phase, atRouter, atHost, outcome, terminal };
}
