import { ObservationPanel } from './ObservationPanel';
import type { LessonProgress } from '@sdl/content-schema';
import {
  boundedNumber,
  measureBatch,
  estimateCapacity,
  initialDns,
  restoreDns,
  dnsStep,
  transferPackets,
} from '@sdl/simulation-engine';
import { Metric, Stepper } from '../../ui/primitives';

type Props = { progress: LessonProgress; onChange(patch: Partial<LessonProgress>): void };
function changeWith({ progress, onChange }: Props) {
  return (patch: LessonProgress['lab']) =>
    onChange({ lab: { ...progress.lab, ...patch }, actions: progress.actions + 1 });
}
const number = (value: number, digits = 0) =>
  value.toLocaleString('vi-VN', { maximumFractionDigits: digits });
export function MetricsLab(props: Props) {
  const { progress } = props,
    change = changeWith(props);
  const workers = boundedNumber(progress.lab['workers'], 1, 1, 4);
  const slow = progress.lab['slow'] === true;
  const result = measureBatch(workers, slow);
  return (
    <section className="lab-panel" aria-label="Thí nghiệm chỉ số">
      <span className="eyebrow">20 lượt cùng đến lúc 0 ms</span>
      <Stepper
        label="Số thủ thư"
        value={workers}
        min={1}
        max={4}
        onChange={(workers) => change({ workers })}
      />
      <button
        className="button secondary"
        aria-pressed={slow}
        onClick={() => change({ slow: !slow })}
      >
        {slow ? 'Cho hai việc cuối nhanh lại' : 'Làm hai việc cuối chậm hơn'}
      </button>
      <p className="muted">
        Hai việc cuối đang mất {slow ? '1.000 ms' : '100 ms'} mỗi việc. ms là mili giây: 1.000 ms =
        1 giây.
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      <ol className="latency-chart" aria-label="Thời gian từ lúc gửi đến khi xong của 20 lượt">
        {result.requests.map((r) => (
          <li key={r.id}>
            <span>#{r.id}</span>
            <span className="latency-track">
              <span style={{ width: `${(r.end / result.windowMs) * 100}%` }} />
            </span>
            <b>{number(r.end)} ms</b>
          </li>
        ))}
      </ol>
      <div className="metrics" aria-live="polite">
        <Metric label="Median" value={number(result.median)} suffix=" ms" />
        <Metric label="p95" value={number(result.p95)} suffix=" ms" />
        <Metric
          label="Throughput cả đợt"
          value={number(result.throughput, 2)}
          suffix=" lượt/giây"
        />
        <Metric label="Thời gian cả đợt" value={number(result.windowMs)} suffix=" ms" />
      </div>
      <p className="muted">
        Mỗi thanh gồm thời gian xếp hàng và xử lý. Thử 2 thủ thư, rồi bật hai việc chậm: median vẫn
        550 ms nhưng p95 từ 1.000 lên 1.900 ms.
      </p>
    </section>
  );
}
const ip = (suffix: number) => (suffix ? `203.0.113.${suffix}` : 'Chưa có');
export function DnsLab({ progress, onChange }: Props) {
  const state = restoreDns(progress.lab);
  const act = (action: 'lookup' | 'move' | 'wait') =>
    onChange({ lab: { ...dnsStep(state, action) }, actions: progress.actions + 1 });
  return (
    <section className="lab-panel" aria-label="Thí nghiệm DNS">
      <div className="lab-head">
        <span className="eyebrow">lich.truong.example</span>
        <span className="time-badge">Giây {state.time}</span>
      </div>
      <dl className="dns-records">
        <div>
          <dt>Cache của resolver</dt>
          <dd>{ip(state.cached)}</dd>
          <dd>
            {state.cached && state.time < state.expiresAt
              ? `Còn ${state.expiresAt - state.time} giây`
              : 'Không dùng được'}
          </dd>
        </div>
        <div>
          <dt>Nơi quản lý tên</dt>
          <dd>{ip(state.source)}</dd>
          <dd>Địa chỉ tại nguồn</dd>
        </div>
      </dl>
      <p>
        Kết quả lần tra gần nhất: <strong>{ip(state.last)}</strong>
      </p>
      <div className="lab-controls">
        <button className="button primary" onClick={() => act('lookup')}>
          Tra địa chỉ
        </button>
        <button className="button secondary" onClick={() => act('move')}>
          Đổi IP ở nguồn
        </button>
        <button className="button secondary" onClick={() => act('wait')}>
          Qua 1 giây
        </button>
      </div>
      <ObservationPanel value={progress.lab['observation']} />
      <div className="feedback" role="status">
        <p>
          {state.route === 'none'
            ? 'Tra lần đầu, đổi IP ở nguồn rồi tra lại trước khi hết hạn.'
            : state.route === 'cache'
              ? `Lần tra gần nhất dùng cache: ${ip(state.last)}. Nguồn hiện tại: ${ip(state.source)}.`
              : `Lần tra gần nhất lấy nguồn: ${ip(state.last)}. Resolver giữ kết quả đến giây ${state.expiresAt}.`}
        </p>
      </div>
      {state.route === 'authoritative' && (
        <p className="dns-trace">
          Đường tra rút gọn: resolver → root → máy chủ tên miền cấp cao → nơi quản lý tên →
          resolver.
        </p>
      )}
      <p className="muted">
        Hết hạn chưa tự tra lại. Bấm “Tra địa chỉ” để lấy câu trả lời mới. Đây là mô phỏng, không
        gửi dữ liệu lên mạng.
      </p>
      <button
        className="text-button"
        onClick={() =>
          onChange({ lab: { ...initialDns(), observation: null }, actions: progress.actions + 1 })
        }
      >
        Đặt lại DNS
      </button>
    </section>
  );
}
export function TransportLab(props: Props) {
  const { progress } = props,
    change = changeWith(props);
  const protocol = progress.lab['protocol'] === 'udp' ? 'udp' : 'tcp';
  const loss = progress.lab['loss'] !== false;
  const step = boundedNumber(progress.lab['step'], 0, 0, 3);
  const result = transferPackets(protocol, loss, step);
  return (
    <section className="lab-panel" aria-label="Thí nghiệm TCP và UDP">
      <span className="eyebrow">Một lần truyền · bước {step}/3</span>
      <div className="lab-controls">
        {(['tcp', 'udp'] as const).map((p) => (
          <button
            key={p}
            className="button secondary"
            aria-pressed={protocol === p}
            onClick={() => change({ protocol: p, step: 0 })}
          >
            {p.toUpperCase()}
          </button>
        ))}
        <button
          className="button secondary"
          aria-pressed={loss}
          onClick={() => change({ loss: !loss, step: 0 })}
        >
          Mất mảnh 2: {loss ? 'bật' : 'tắt'}
        </button>
      </div>
      <div className="packet-board">
        {[1, 2, 3].map((n) => (
          <div key={n} className={result.delivered.includes(n) ? 'packet delivered' : 'packet'}>
            <strong>{n}</strong>
            <span>
              {result.delivered.includes(n)
                ? 'Ứng dụng nhận'
                : result.received.includes(n)
                  ? 'Giữ trong bộ đệm'
                  : step >= 2
                    ? 'Bị mất trên đường'
                    : step === 1
                      ? 'Đang gửi'
                      : 'Chưa gửi'}
            </span>
          </div>
        ))}
      </div>
      <div className="lab-controls">
        <button
          className="button primary"
          disabled={step === 3}
          onClick={() => change({ step: step + 1 })}
        >
          {step === 0 ? 'Gửi ba mảnh' : step === 1 ? 'Nhận tại đích' : 'Xem bước khôi phục'}
        </button>
        <button className="button secondary" onClick={() => change({ step: 0 })}>
          Thử lại
        </button>
      </div>
      <ObservationPanel value={progress.lab['observation']} />
      <div className="feedback" role="status">
        <p>
          {step < 2
            ? 'Gửi rồi nhận tại đích để thấy phần nào đến ứng dụng.'
            : protocol === 'tcp' && loss && step === 2
              ? 'TCP: phần 1 đến ứng dụng; phần 3 giữ lại vì còn thiếu phần 2.'
              : protocol === 'udp' && loss
                ? 'UDP: ứng dụng nhận thông điệp 1 và 3. UDP không tự gửi lại thông điệp 2.'
                : 'Ứng dụng đã nhận đủ ba phần trong lần thử này.'}
        </p>
      </div>
      <div className="metrics">
        <Metric label="Ứng dụng nhận" value={result.delivered.length} suffix=" phần" />
        <Metric label="Còn giữ trong bộ đệm" value={result.buffered} />
        <Metric label="Lần gửi lại" value={result.retransmissions} />
      </div>
      <p className="muted">
        TCP là luồng byte; các số đánh dấu ba vùng byte liền nhau. UDP là ba thông điệp độc lập. Sơ
        đồ không so sánh tốc độ hai giao thức.
      </p>
    </section>
  );
}
export function CapacityLab(props: Props) {
  const { progress } = props,
    change = changeWith(props);
  const students = boundedNumber(progress.lab['students'], 1000, 100, 5000);
  const views = boundedNumber(progress.lab['views'], 10, 1, 50);
  const size = boundedNumber(progress.lab['size'], 100, 10, 500);
  const peak = boundedNumber(progress.lab['peak'], 4, 1, 10);
  const result = estimateCapacity(students, views, size, peak);
  return (
    <section className="lab-panel" aria-label="Thí nghiệm ước lượng">
      <span className="eyebrow">Một ảnh riêng cho mỗi học sinh</span>
      <Stepper
        label="Số học sinh"
        value={students}
        min={100}
        max={5000}
        step={100}
        onChange={(students) => change({ students })}
      />
      <Stepper
        label="Lượt mỗi người mỗi ngày"
        value={views}
        min={1}
        max={50}
        onChange={(views) => change({ views })}
      />
      <Stepper
        label="Kích thước ảnh"
        unit="kB, đơn vị thập phân"
        value={size}
        min={10}
        max={500}
        step={10}
        onChange={(size) => change({ size })}
      />
      <Stepper
        label="Hệ số đỉnh giả định"
        value={peak}
        min={1}
        max={10}
        onChange={(peak) => change({ peak })}
      />
      <ObservationPanel value={progress.lab['observation']} />
      <div className="estimate-sheet" aria-live="polite">
        <p>
          <b>
            {number(students)} × {views} = {number(result.daily)}
          </b>{' '}
          lượt/ngày
        </p>
        <p>
          Chia 86.400 → <b>{number(result.averageRps, 3)}</b> lượt/giây trung bình
        </p>
        <p>
          Nhân {peak} → <b>{number(result.peakRps, 3)}</b> lượt/giây đỉnh giả định
        </p>
      </div>
      <div className="metrics">
        <Metric label="Dữ liệu truyền mỗi ngày" value={number(result.transferMB)} suffix=" MB" />
        <Metric label="Ảnh duy nhất cần lưu" value={number(result.storageMB)} suffix=" MB" />
      </div>
      <p className="muted">
        1 MB = 1.000 kB. Tăng số lượt xem để thấy dữ liệu truyền tăng, còn dung lượng ảnh lưu giữ
        nguyên. Chưa tính bản sao, backup hoặc cache.
      </p>
    </section>
  );
}
