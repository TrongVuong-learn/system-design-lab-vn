import type { CacheState, CacheCommand, QueueState } from './index';
import { estimateDownload } from './network';
export type Observation = {
  schemaVersion: 1;
  action: string;
  rows: { label: string; before: string; after: string }[];
  reason: string;
};
const n = (v: number) => v.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
const row = (label: string, before: string | number, after: string | number) => ({
  label,
  before: String(before),
  after: String(after),
});
export function observeCache(
  before: CacheState,
  after: CacheState,
  command: CacheCommand,
): Observation {
  const valid = after.time - after.refreshedAt < after.ttl;
  const room = (v: number | null) => (v === null ? 'Chưa có' : `Phòng ${v}`);
  const actions = {
    read: 'Xem lịch',
    update: 'Đổi phòng ở nguồn',
    refresh: 'Lấy lịch mới',
    wait: 'Qua 1 phút',
    ttl: 'Đổi thời hạn bản ghi',
  };
  const reason =
    command.type === 'read'
      ? after.hits > before.hits
        ? `Bản ghi còn hạn nên lần xem này dùng phòng ${after.last} từ cache.${after.last !== after.source ? ' Nguồn đã đổi, nhưng bản ghi gần chưa được cập nhật.' : ' Phòng này khớp với nguồn.'}`
        : `Bản ghi hết hạn nên lần xem này đọc nguồn, trả phòng ${after.last} và lấy lại bản ghi gần.`
      : command.type === 'update'
        ? 'Chỉ lịch ở nguồn đổi. Bản ghi gần và kết quả lần xem trước vẫn giữ nguyên; muốn biết người xem nhận gì, hãy bấm “Xem lịch”.'
        : command.type === 'refresh'
          ? 'Đọc nguồn để cập nhật bản ghi gần và bắt đầu lại thời hạn. Kết quả lần xem trước vẫn là lịch sử, không tự đổi theo.'
          : command.type === 'wait'
            ? valid
              ? 'Thời gian tăng một phút; bản ghi vẫn còn hạn. Chưa có lượt xem mới.'
              : 'Bản ghi đã đến hạn, nhưng chưa tự lấy nguồn. Lần “Xem lịch” tiếp theo mới đọc nguồn và cập nhật.'
            : `Thời hạn mới tính từ lần lấy bản ghi gần nhất, không bắt đầu lại đồng hồ.${valid ? ' Bản ghi hiện còn hạn.' : ' Bản ghi hiện hết hạn; lần xem tiếp theo đọc nguồn.'}`;
  return {
    schemaVersion: 1,
    action: actions[command.type],
    rows: [
      row('Lịch ở nguồn', room(before.source), room(after.source)),
      row('Bản ghi gần', room(before.cached), room(after.cached)),
      row('Lần xem gần nhất', room(before.last), room(after.last)),
      row(
        'Thời hạn còn lại',
        `${Math.max(0, before.ttl - (before.time - before.refreshedAt))} phút`,
        `${Math.max(0, after.ttl - (after.time - after.refreshedAt))} phút`,
      ),
    ],
    reason,
  };
}
export function observeQueue(
  before: QueueState,
  after: QueueState,
  arrivals: number,
  workers: number,
  previousArrivals: number,
  previousWorkers: number,
): Observation {
  const stepped = after.second > before.second;
  const done = after.processed - before.processed;
  return {
    schemaVersion: 1,
    action: stepped ? 'Qua 1 giây' : 'Đổi cấu hình',
    rows: [
      row('Việc đến', `${previousArrivals} việc/giây`, `${arrivals} việc/giây`),
      row('Công suất xử lý', `${previousWorkers * 2} việc/giây`, `${workers * 2} việc/giây`),
      row('Đang chờ', `${before.queued} việc`, `${after.queued} việc`),
    ],
    reason: stepped
      ? `Có ${before.queued} việc chờ + ${arrivals} việc mới. ${workers} worker có thể làm tối đa ${workers * 2} việc; thực tế làm xong ${done}. Còn ${before.queued} + ${arrivals} − ${done} = ${after.queued} việc chờ.${after.queued === 0 ? ' Hàng chờ hiện trống.' : after.queued === before.queued ? ' Hàng chờ giữ nguyên; cần công suất dư để giảm tồn cũ.' : after.queued > before.queued ? ' Việc đến nhiều hơn số làm xong, nên hàng chờ tăng.' : ' Làm xong nhiều hơn việc mới, nên hàng chờ giảm.'}`
      : `Chưa qua thêm giây nào, nên hàng chờ và số đã hoàn thành chưa đổi. Mỗi giây tiếp theo có ${arrivals} việc mới; ${workers} worker có thể làm tối đa ${workers * 2} việc. Bấm “Qua 1 giây” để kiểm tra.`,
  };
}
export function observeNetwork(
  before: { rtt: number; rate: number; size: number },
  after: { rtt: number; rate: number; size: number },
): Observation {
  const a = estimateDownload(before.rtt, before.rate, before.size),
    b = estimateDownload(after.rtt, after.rate, after.size);
  const cause =
    before.rate !== after.rate
      ? `Tốc độ truyền đổi từ ${before.rate} sang ${after.rate} Mbps. Cùng một ảnh, phần truyền bằng kích thước × 8 ÷ tốc độ; RTT và xử lý giữ nguyên.`
      : before.size !== after.size
        ? `Ảnh đổi từ ${n(before.size)} sang ${n(after.size)} kB. Với tốc độ giữ nguyên, ảnh lớn hơn cần nhiều thời gian truyền hơn; RTT và xử lý giữ nguyên.`
        : `RTT đổi từ ${before.rtt} sang ${after.rtt} ms. Phần truyền và xử lý giữ nguyên; tổng đổi đúng bằng phần RTT thay đổi.`;
  return {
    schemaVersion: 1,
    action: 'Đổi tham số tải ảnh',
    rows: [
      row('Đi và về', `${n(a.rttMs)} ms`, `${n(b.rttMs)} ms`),
      row('Máy chủ xử lý', '50 ms', '50 ms'),
      row('Truyền ảnh', `${n(a.transferMs)} ms`, `${n(b.transferMs)} ms`),
      row('Tổng lý tưởng', `${n(a.totalMs)} ms`, `${n(b.totalMs)} ms`),
    ],
    reason: `${cause} Tổng mới: ${n(b.rttMs)} + 50 + ${n(b.transferMs)} = ${n(b.totalMs)} ms trong mô hình.`,
  };
}
/** Imported local progress is untrusted; ignore malformed optional observations. */
export function parseObservation(value: unknown): Observation | null {
  if (typeof value !== 'string' || value.length > 2000) return null;
  try {
    const o = JSON.parse(value);
    const text = (v: unknown) => typeof v === 'string' && v.length > 0 && v.length <= 1000;
    if (
      o?.schemaVersion !== 1 ||
      !text(o?.action) ||
      !text(o?.reason) ||
      !Array.isArray(o.rows) ||
      o.rows.length < 1 ||
      o.rows.length > 4 ||
      !o.rows.every(
        (r: Record<string, unknown>) => r && text(r.label) && text(r.before) && text(r.after),
      )
    )
      return null;
    return o as Observation;
  } catch {
    return null;
  }
}
