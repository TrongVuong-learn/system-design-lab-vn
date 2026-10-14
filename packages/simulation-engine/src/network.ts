import { boundedNumber } from './index';

/** One request over a warm connection; constant payload rate, no loss/overhead/slow start. */
export function estimateDownload(rtt: number, rateMbps: number, sizeKB: number) {
  const rttMs = boundedNumber(rtt, 100, 20, 200);
  const mbps = boundedNumber(rateMbps, 8, 1, 32);
  const kb = boundedNumber(sizeKB, 1000, 100, 10000);
  const processingMs = 50;
  // kB * 1000 bytes * 8 bits / (Mbps * 1_000_000 bits/s) * 1000 ms/s.
  const transferMs = (kb * 8) / mbps;
  return { rttMs, processingMs, transferMs, totalMs: rttMs + processingMs + transferMs };
}

/** The server remains reachable even during maintenance and returns an HTTP response. */
export function httpExchange(
  resource: 'timetable' | 'missing',
  maintenance: boolean,
  step: number,
) {
  const phase = boundedNumber(step, 0, 0, 2);
  const target = resource === 'missing' ? '/lich-khong-co' : '/lich-hoc';
  const request = { method: 'GET', target, accept: 'application/json' };
  if (phase < 2) return { phase, request, response: null };
  const response = maintenance
    ? { status: 503, reason: 'Service Unavailable', body: '{"thongBao":"Dịch vụ đang bảo trì"}' }
    : resource === 'missing'
      ? {
          status: 404,
          reason: 'Not Found',
          body: '{"thongBao":"Không tìm thấy lịch ở đường dẫn này"}',
        }
      : { status: 200, reason: 'OK', body: '{"phong":201}' };
  return { phase, request, response: { ...response, contentType: 'application/json' } };
}
