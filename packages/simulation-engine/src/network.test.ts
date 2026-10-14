import { it, expect } from 'vitest';
import { estimateDownload, httpExchange } from './index';
it('halves only payload serialization time when the rate doubles', () => {
  const initial = estimateDownload(100, 8, 1000),
    faster = estimateDownload(100, 16, 1000);
  expect(initial).toEqual({ rttMs: 100, processingMs: 50, transferMs: 1000, totalMs: 1150 });
  expect(faster).toEqual({ rttMs: 100, processingMs: 50, transferMs: 500, totalMs: 650 });
  expect(faster.totalMs).not.toBe(initial.totalMs / 2);
});
it('converts decimal kilobytes into bits and preserves independent RTT', () => {
  expect(estimateDownload(100, 8, 100)).toMatchObject({ transferMs: 100, totalMs: 250 });
  expect(estimateDownload(200, 8, 100)).toMatchObject({ transferMs: 100, totalMs: 350 });
  expect(estimateDownload(-2, NaN, Infinity)).toEqual(estimateDownload(100, 8, 1000));
});
it('returns no response before delivery, then explicit 200/404/503 messages', () => {
  expect(httpExchange('timetable', false, 1).response).toBeNull();
  expect(httpExchange('timetable', false, 2)).toMatchObject({
    request: { method: 'GET', target: '/lich-hoc' },
    response: { status: 200, contentType: 'application/json' },
  });
  expect(httpExchange('missing', false, 2).response?.status).toBe(404);
  expect(httpExchange('timetable', true, 2).response?.status).toBe(503);
  expect(httpExchange('missing', true, 2).response?.status).toBe(503);
  expect(httpExchange('missing', false, -7).response).toBeNull();
});
