import { it, expect } from 'vitest';
import {
  observeRemaining,
  parseObservation,
  initialDns,
  dnsStep,
  initialReplica,
  replicaWrite,
  replicaTick,
  measureBatch,
  type GuidedKind,
} from './index';
it('DNS preserves historical results on clock/move and refreshes at TTL boundary', () => {
  const first = dnsStep(initialDns(), 'lookup'),
    moved = dnsStep(first, 'move');
  const move = observeRemaining('dns', { ...first }, { ...moved })!;
  expect(move.reason).toContain('chưa được cập nhật');
  expect(move.rows.find((r) => r.label === 'Lần tra gần nhất')?.after).toBe('203.0.113.10');
  let state = moved;
  for (let i = 0; i < 4; i++) state = dnsStep(state, 'wait');
  const expired = dnsStep(state, 'wait');
  expect(observeRemaining('dns', { ...state }, { ...expired })?.reason).toContain(
    'hết hạn chưa tự tra',
  );
  const refreshed = dnsStep(expired, 'lookup');
  expect(
    observeRemaining('dns', { ...expired }, { ...refreshed })?.rows.find(
      (r) => r.label === 'Lần tra gần nhất',
    )?.after,
  ).toBe('203.0.113.20');
});
it('replica lag changes preserve existing scheduled writes and zero-lag write-back is not a reset', () => {
  const written = replicaWrite(initialReplica(), 205, 3),
    encode = (s: typeof written, lag: number) => ({
      ...s,
      pending: JSON.stringify(s.pending),
      lag,
    });
  const lag = observeRemaining('replica', encode(written, 3), encode(written, 1))!;
  expect(lag.rows[0]).toEqual({ label: 'Độ trễ ghi mới', before: '3 giây', after: '1 giây' });
  expect(lag.reason).toContain('giữ thời điểm cũ');
  const tick = replicaTick(written);
  expect(observeRemaining('replica', encode(written, 1), encode(tick, 1))?.reason).toContain(
    'chưa có thay đổi tới lượt',
  );
  const immediate = replicaWrite(initialReplica(), 205, 0),
    back = replicaWrite(immediate, 201, 0);
  expect(observeRemaining('replica', encode(immediate, 0), encode(back, 0))?.reason).toContain(
    'lần ghi này cập nhật bản sao ngay',
  );
});
it('transport distinguishes TCP buffered byte ranges from UDP datagrams and conditions recovery', () => {
  const tcp = observeRemaining(
    'transport',
    { protocol: 'tcp', loss: true, step: 1 },
    { protocol: 'tcp', loss: true, step: 2 },
  )!;
  expect(tcp.rows).toContainEqual({ label: 'Ứng dụng đã nhận', before: '0 phần', after: '1 phần' });
  expect(tcp.rows).toContainEqual({ label: 'Giữ trong bộ đệm', before: '0', after: '1' });
  expect(
    observeRemaining(
      'transport',
      { protocol: 'tcp', loss: true, step: 2 },
      { protocol: 'tcp', loss: true, step: 3 },
    )?.reason,
  ).toContain('giả định lần gửi lại');
  expect(
    observeRemaining(
      'transport',
      { protocol: 'udp', loss: true, step: 2 },
      { protocol: 'udp', loss: true, step: 3 },
    )?.reason,
  ).toContain('không tự gửi lại');
});
it('metrics uses fresh batches and capacity separates transfer from storage', () => {
  const o = observeRemaining('metrics', { workers: 2, slow: false }, { workers: 2, slow: true })!;
  expect(o.rows).toContainEqual({ label: 'Median', before: '550 ms', after: '550 ms' });
  expect(o.rows).toContainEqual({ label: 'p95', before: '1.000 ms', after: '1.900 ms' });
  expect(measureBatch(2, true).throughput).toBeCloseTo(20 / 1.9);
  const capacity = observeRemaining('capacity', { views: 10 }, { views: 20 })!;
  expect(capacity.rows).toContainEqual({
    label: 'Ảnh duy nhất lưu',
    before: '100 MB',
    after: '100 MB',
  });
  expect(capacity.rows).toContainEqual({
    label: 'Truyền mỗi ngày',
    before: '1.000 MB',
    after: '2.000 MB',
  });
});
it('traffic does not invent cumulative backlog and HTTP/routing distinguish reachability from results', () => {
  const traffic = observeRemaining('balance', { servers: 1 }, { servers: 3 })!;
  expect(traffic.rows).toContainEqual({
    label: 'Đọc hoàn tất',
    before: '4 lượt/giây',
    after: '4 lượt/giây',
  });
  expect(traffic.reason).toContain('không cộng số chờ');
  const http = observeRemaining(
    'http',
    { resource: 'missing', step: 1 },
    { resource: 'missing', step: 2 },
  )!;
  expect(http.rows).toContainEqual({ label: 'Mã đã nhận', before: 'Chưa nhận', after: '404' });
  const routing = observeRemaining(
    'routing',
    { route: false, step: 0 },
    { route: false, step: 1 },
  )!;
  expect(routing.reason).toContain('không có route');
  expect(
    observeRemaining(
      'routing',
      { route: false, port: 8080, step: 1 },
      { route: false, port: 9090, step: 0 },
    )?.reason,
  ).toContain('quay về bước chưa gửi');
});
it('all ten kinds produce bounded versioned observations or explicit reset, including malformed checkpoints', () => {
  const examples: [GuidedKind, Record<string, unknown>][] = [
    ['request', { step: 1 }],
    ['balance', { servers: 2 }],
    ['replica', { time: 1 }],
    ['design', { cache: true }],
    ['metrics', { workers: 2 }],
    ['dns', { source: 20 }],
    ['transport', { step: 1 }],
    ['capacity', { views: 20 }],
    ['http', { step: 1 }],
    ['routing', { step: 1 }],
  ];
  for (const [kind, after] of examples) {
    const o = observeRemaining(kind, {}, after)!;
    expect(o).not.toBeNull();
    const saved = JSON.stringify(o);
    expect(saved.length).toBeLessThanOrEqual(2000);
    expect(parseObservation(saved)).toEqual(o);
    expect(
      observeRemaining(kind, { workers: -2, pending: 'broken', step: 999 }, after),
    ).not.toBeUndefined();
  }
  expect(observeRemaining('request', { step: 3 }, { step: 0 })).toBeNull();
  expect(observeRemaining('http', { step: 2 }, { step: 0 })).toBeNull();
});
