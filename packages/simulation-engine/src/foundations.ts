import { boundedNumber } from './index';

/** Twenty requests all arrive at t=0, FIFO, identical workers; no network overhead. */
export function measureBatch(workers: number, slowLast: boolean) {
  const count = boundedNumber(workers, 1, 1, 4);
  const available = Array<number>(count).fill(0);
  const requests = Array.from({ length: 20 }, (_, i) => {
    const worker = available.indexOf(Math.min(...available));
    const duration = slowLast && i >= 18 ? 1000 : 100;
    const start = available[worker]!;
    const end = start + duration;
    available[worker] = end;
    return { id: i + 1, start, end, duration, worker };
  });
  const ordered = requests.map((r) => r.end).sort((a, b) => a - b);
  const windowMs = Math.max(...available);
  return {
    requests,
    windowMs,
    median: (ordered[9]! + ordered[10]!) / 2,
    p95: ordered[Math.ceil(0.95 * ordered.length) - 1]!,
    throughput: 20000 / windowMs,
  };
}
export function estimateCapacity(
  students: number,
  dailyViews: number,
  sizeKB: number,
  peakFactor: number,
) {
  const users = boundedNumber(students, 1000, 100, 5000);
  const views = boundedNumber(dailyViews, 10, 1, 50);
  const kb = boundedNumber(sizeKB, 100, 10, 500);
  const factor = boundedNumber(peakFactor, 4, 1, 10);
  const daily = users * views;
  return {
    daily,
    averageRps: daily / 86400,
    peakRps: (daily / 86400) * factor,
    transferMB: (daily * kb) / 1000,
    storageMB: (users * kb) / 1000,
  };
}
export interface DnsState {
  time: number;
  source: number;
  cached: number;
  expiresAt: number;
  last: number;
  route: string;
}
export const initialDns = (): DnsState => ({
  time: 0,
  source: 10,
  cached: 0,
  expiresAt: 0,
  last: 0,
  route: 'none',
});
export function restoreDns(raw: Record<string, unknown>): DnsState {
  const s = { ...initialDns(), ...raw } as DnsState;
  if (
    !Number.isSafeInteger(s.time) ||
    s.time < 0 ||
    !Number.isSafeInteger(s.expiresAt) ||
    s.expiresAt < 0 ||
    s.expiresAt > s.time + 5 ||
    ![10, 20].includes(s.source) ||
    ![0, 10, 20].includes(s.cached) ||
    ![0, 10, 20].includes(s.last) ||
    !['none', 'cache', 'authoritative'].includes(s.route)
  )
    return initialDns();
  return s;
}
export function dnsStep(s: DnsState, action: 'lookup' | 'move' | 'wait'): DnsState {
  if (action === 'move') return { ...s, source: s.source === 10 ? 20 : 10 };
  if (action === 'wait') return { ...s, time: s.time + 1 };
  if (s.cached !== 0 && s.time < s.expiresAt) return { ...s, last: s.cached, route: 'cache' };
  return { ...s, cached: s.source, last: s.source, expiresAt: s.time + 5, route: 'authoritative' };
}
/** Segments 1,2,3 carry adjacent byte ranges. Simplified loss/retransmission trace, not a TCP stack. */
export function transferPackets(protocol: 'tcp' | 'udp', loss: boolean, step: number) {
  const phase = boundedNumber(step, 0, 0, 3);
  const received =
    phase < 2 ? [] : loss ? (phase === 3 && protocol === 'tcp' ? [1, 2, 3] : [1, 3]) : [1, 2, 3];
  const delivered = protocol === 'tcp' && loss && phase === 2 ? [1] : received;
  return {
    received,
    delivered,
    buffered: received.length - delivered.length,
    retransmissions: phase === 3 && loss && protocol === 'tcp' ? 1 : 0,
  };
}
