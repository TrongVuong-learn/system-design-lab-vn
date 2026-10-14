import { ObservationPanel } from './ObservationPanel';
import type { LessonProgress } from '@sdl/content-schema';
import {
  boundedNumber,
  estimateDownload,
  httpExchange,
  observeNetwork,
} from '@sdl/simulation-engine';
import { Metric, Stepper } from '../../ui/primitives';

type Props = { progress: LessonProgress; onChange(patch: Partial<LessonProgress>): void };
const number = (n: number) => n.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
export function HttpLab({ progress, onChange }: Props) {
  const resource = progress.lab['resource'] === 'missing' ? 'missing' : 'timetable';
  const maintenance = progress.lab['maintenance'] === true;
  const step = boundedNumber(progress.lab['step'], 0, 0, 2);
  const result = httpExchange(resource, maintenance, step);
  const change = (patch: LessonProgress['lab']) =>
    onChange({ lab: { ...progress.lab, ...patch }, actions: progress.actions + 1 });
  const response = result.response;
  return (
    <section className="lab-panel" aria-label="Thí nghiệm HTTP">
      <div className="lab-head">
        <span className="eyebrow">Một yêu cầu GET</span>
        <span className="time-badge">Bước {step}/2</span>
      </div>
      <div className="lab-controls">
        <button
          className="button primary"
          disabled={step === 2}
          onClick={() => change({ step: step + 1 })}
        >
          {step === 0 ? 'Gửi yêu cầu' : 'Xem phản hồi'}
        </button>
        <button className="button secondary" onClick={() => change({ step: 0 })}>
          Thử lại yêu cầu
        </button>
      </div>
      <fieldset className="http-choices">
        <legend>Đường dẫn bạn muốn hỏi</legend>
        <div className="lab-controls">
          <button
            className="button secondary"
            aria-pressed={resource === 'timetable'}
            onClick={() => change({ resource: 'timetable', step: 0 })}
          >
            Lịch học có thật
          </button>
          <button
            className="button secondary"
            aria-pressed={resource === 'missing'}
            onClick={() => change({ resource: 'missing', step: 0 })}
          >
            Đường dẫn không có
          </button>
        </div>
      </fieldset>
      <button
        className="button secondary"
        aria-pressed={maintenance}
        onClick={() => change({ maintenance: !maintenance, step: 0 })}
      >
        {maintenance ? 'Kết thúc bảo trì' : 'Cho dịch vụ bảo trì'}
      </button>
      <div className="http-messages">
        <section className="http-message" aria-label="Thông điệp yêu cầu">
          <h3>Yêu cầu từ trình duyệt</h3>
          <dl>
            <dt>Phương thức · xin đọc</dt>
            <dd>GET</dd>
            <dt>Đường dẫn · tài nguyên cần lấy</dt>
            <dd>
              <code>{result.request.target}</code>
            </dd>
            <dt>Header · định dạng có thể nhận</dt>
            <dd>
              <code>Accept: application/json</code>
            </dd>
          </dl>
          <p className="muted">GET này không có body và không đổi dữ liệu trong mô hình.</p>
        </section>
        <section className="http-message" aria-label="Thông điệp phản hồi">
          <h3>Phản hồi từ máy chủ</h3>
          {response ? (
            <dl>
              <dt>Mã trạng thái</dt>
              <dd>
                <strong>
                  {response.status} {response.reason}
                </strong>
              </dd>
              <dt>Header · định dạng nội dung</dt>
              <dd>
                <code>Content-Type: {response.contentType}</code>
              </dd>
              <dt>Body · nội dung</dt>
              <dd>
                <code>{response.body}</code>
              </dd>
            </dl>
          ) : (
            <p>
              {step === 0 ? 'Chưa gửi yêu cầu.' : 'Yêu cầu đã đến máy chủ. Bấm “Xem phản hồi”.'}
            </p>
          )}
        </section>
      </div>
      <div className="feedback" role="status">
        <p>
          {response
            ? response.status === 200
              ? 'Nhận 200 và nội dung phòng 201. Đọc mã và nội dung là hai việc khác nhau.'
              : response.status === 404
                ? 'Nhận 404: máy chủ đã trả lời, nhưng không tìm thấy lịch ở đường dẫn đã hỏi.'
                : 'Nhận 503: bộ nhận HTTP vẫn hoạt động, dịch vụ đang tạm bảo trì.'
            : 'Gửi yêu cầu, xem phản hồi rồi thử thay đường dẫn hoặc trạng thái bảo trì.'}
        </p>
      </div>
      <p className="muted">
        JSON trong body là văn bản có tên trường và giá trị. Không có yêu cầu mạng thật được gửi; sơ
        đồ này dùng cách trình bày HTTP/1.1.
      </p>
    </section>
  );
}
export function NetworkLab({ progress, onChange }: Props) {
  const rtt = boundedNumber(progress.lab['rtt'], 100, 20, 200);
  const rate = boundedNumber(progress.lab['rate'], 8, 1, 32);
  const size = boundedNumber(progress.lab['size'], 1000, 100, 10000);
  const result = estimateDownload(rtt, rate, size);
  const change = (patch: LessonProgress['lab']) => {
    const before = { rtt, rate, size };
    const after = {
      rtt: Number(patch['rtt'] ?? rtt),
      rate: Number(patch['rate'] ?? rate),
      size: Number(patch['size'] ?? size),
    };
    onChange({
      lab: {
        ...progress.lab,
        ...patch,
        observation: JSON.stringify(observeNetwork(before, after)),
      },
      actions: progress.actions + 1,
    });
  };
  const parts = [
    { label: 'Đi và về (RTT)', value: result.rttMs, className: 'rtt' },
    { label: 'Máy chủ xử lý', value: result.processingMs, className: 'processing' },
    { label: 'Truyền ảnh', value: result.transferMs, className: 'transfer' },
  ];
  return (
    <section className="lab-panel" aria-label="Thí nghiệm thời gian tải">
      <span className="eyebrow">Một ảnh · kết nối đã có</span>
      <Stepper
        label="Thời gian đi về"
        unit="ms; 1.000 ms = 1 giây"
        value={rtt}
        min={20}
        max={200}
        step={20}
        onChange={(rtt) => change({ rtt })}
      />
      <Stepper
        label="Tốc độ truyền giả định"
        unit="Mbps; triệu bit mỗi giây"
        value={rate}
        min={1}
        max={32}
        onChange={(rate) => change({ rate })}
      />
      <Stepper
        label="Kích thước ảnh tải"
        unit="kB; 1 kB = 1.000 byte"
        value={size}
        min={100}
        max={10000}
        step={100}
        onChange={(size) => change({ size })}
      />
      <ObservationPanel value={progress.lab['observation']} />
      <ol className="download-parts" aria-label="Ba phần thời gian cộng nối tiếp">
        {parts.map((part) => (
          <li key={part.label}>
            <span>{part.label}</span>
            <div className={`download-track ${part.className}`} aria-hidden="true">
              <span style={{ width: `${(part.value / result.totalMs) * 100}%` }} />
            </div>
            <strong>{number(part.value)} ms</strong>
          </li>
        ))}
      </ol>
      <div className="estimate-sheet" aria-live="polite">
        <p>
          1 byte = 8 bit. Phần truyền: {number(size)} kB × 8 ÷ {rate} Mbps ={' '}
          <b>{number(result.transferMs)} ms</b>.
        </p>
        <p>
          Tổng: {rtt} + 50 + {number(result.transferMs)} = <b>{number(result.totalMs)} ms</b>.
        </p>
      </div>
      <div className="metrics">
        <Metric label="Tổng thời gian lý tưởng" value={number(result.totalMs)} suffix=" ms" />
      </div>
      <p className="muted">
        Máy chủ luôn xử lý 50 ms. Mbps là bit/giây, không phải byte/giây. Thử tốc độ 8 rồi 16 Mbps:
        phần truyền giảm một nửa; RTT và xử lý giữ nguyên.
      </p>
    </section>
  );
}
