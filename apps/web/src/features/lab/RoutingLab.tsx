import { ObservationPanel } from './ObservationPanel';
import type { LessonProgress } from '@sdl/content-schema';
import { routePacket } from '@sdl/simulation-engine';
const messages = {
  ready: 'Chưa gửi. Chọn IP đích và port của dịch vụ muốn gọi.',
  forwarding:
    'Router có route tới IP đích và chuyển tới chặng tiếp theo. Port không chọn đường IP trong mô hình này.',
  'no-route':
    'Dừng ở router: không có route và không có route mặc định. Đổi port chưa sửa được đường đi.',
  'at-host': 'Đã tới máy trường. Tiếp theo, máy đích xem port TCP để chọn dịch vụ.',
  'other-host':
    'Đã tới máy khác theo IP bạn chọn. Đúng port ở máy khác không đưa yêu cầu về máy trường.',
  'not-listening':
    'Đã tới máy trường, nhưng không có dịch vụ TCP lắng nghe ở port 8181 trong mô hình.',
  library: 'Đã tới dịch vụ thư viện ở port TCP 9090. Đây chưa phải dịch vụ lịch học bạn cần.',
  timetable: 'Đã tới dịch vụ lịch học ở port TCP 8080.',
};
export function RoutingLab({
  progress,
  onChange,
}: {
  progress: LessonProgress;
  onChange(patch: Partial<LessonProgress>): void;
}) {
  const result = routePacket(
    progress.lab['destination'],
    progress.lab['port'],
    progress.lab['route'],
    progress.lab['step'],
  );
  const change = (patch: LessonProgress['lab']) =>
    onChange({ lab: { ...progress.lab, ...patch }, actions: progress.actions + 1 });
  return (
    <section className="lab-panel" aria-label="Thí nghiệm IP và port">
      <h2>Đưa yêu cầu tới lịch học</h2>
      <p>
        Máy trường: 192.0.2.10. Lịch học lắng nghe TCP 8080; thư viện lắng nghe TCP 9090. Đây là cấu
        hình giả định.
      </p>
      <div className="routing-inputs">
        <label>
          IP đích
          <select
            value={result.ip === '198.51.100.20' ? 'other' : 'school'}
            onChange={(e) => change({ destination: e.target.value, step: 0 })}
          >
            <option value="school">192.0.2.10 · máy trường</option>
            <option value="other">198.51.100.20 · máy khác</option>
          </select>
        </label>
        <label>
          Port TCP đích
          <select
            value={result.destinationPort}
            onChange={(e) => change({ port: Number(e.target.value), step: 0 })}
          >
            <option value={8080}>8080 · lịch học</option>
            <option value={9090}>9090 · thư viện</option>
            <option value={8181}>8181 · không có dịch vụ</option>
          </select>
        </label>
      </div>
      <div className="lab-controls">
        <button
          className="button primary"
          disabled={result.terminal}
          onClick={() => change({ step: result.phase + 1 })}
        >
          {result.phase === 0
            ? 'Gửi tới router'
            : result.phase === 1
              ? 'Chuyển tới máy đích'
              : 'Chọn dịch vụ tại đích'}
        </button>
        <button className="button secondary" onClick={() => change({ step: 0 })}>
          Bắt đầu lại đường đi
        </button>
        <button
          className="button secondary"
          aria-pressed={!result.hasRoute}
          onClick={() => change({ route: !result.hasRoute, step: 0 })}
        >
          {result.hasRoute ? 'Bỏ route ở router' : 'Khôi phục route ở router'}
        </button>
      </div>
      <ol className="routing-trace" aria-label="Đường đi của yêu cầu">
        <li>
          <strong>Máy bạn · 203.0.113.5</strong>
          <span>
            Chuẩn bị đích {result.ip}, TCP {result.destinationPort}.
          </span>
        </li>
        <li>
          <strong>Router · chọn chặng tiếp theo</strong>
          <span>
            {!result.atRouter
              ? 'Chưa tới router.'
              : result.hasRoute
                ? `Có route tới ${result.ip}; IP đích vẫn giữ nguyên.`
                : 'Không có route tới đích trong bảng giả định.'}
          </span>
        </li>
        <li>
          <strong>Máy đích · chọn dịch vụ</strong>
          <span>
            {!result.atHost
              ? 'Chưa tới máy đích.'
              : `Tới ${result.ip}. Port TCP đích: ${result.destinationPort}.`}
          </span>
        </li>
      </ol>
      <ObservationPanel value={progress.lab['observation']} />
      <div className="feedback" role="status">
        <p>{messages[result.outcome as keyof typeof messages]}</p>
      </div>
      <p className="muted">
        Route chỉ được bật/tắt trong bảng cố định. Không mô phỏng DNS, NAT, firewall, ARP, mất gói
        hay TCP handshake. Các địa chỉ dùng cho tài liệu, không gửi yêu cầu mạng thật.
      </p>
    </section>
  );
}
