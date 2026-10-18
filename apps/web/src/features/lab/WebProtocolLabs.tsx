import type { LessonProgress } from '@sdl/content-schema';
import {
  cookieSession,
  reverseProxy,
  multiplexLoss,
  WEB_PROTOCOL_MODEL_VERSION,
} from '@sdl/simulation-engine';
import { ObservationPanel } from './ObservationPanel';
type Props = { progress: LessonProgress; onChange(patch: Partial<LessonProgress>): void };
function observation(action: string, before: string, after: string, reason: string) {
  return JSON.stringify({
    schemaVersion: 1,
    action,
    rows: [{ label: 'Chặng', before, after }],
    reason,
  });
}
export function CookieSessionLab({ progress, onChange }: Props) {
  const s = cookieSession(progress.lab);
  function configure(mode: string = s.config.mode) {
    onChange({
      lab: { mode, step: 0, modelVersion: WEB_PROTOCOL_MODEL_VERSION, observation: '' },
      actions: progress.actions + 1,
    });
  }
  function run() {
    const step = s.step + 1;
    const next = cookieSession({ ...s.config, step, modelVersion: WEB_PROTOCOL_MODEL_VERSION });
    onChange({
      lab: {
        ...s.config,
        step,
        modelVersion: WEB_PROTOCOL_MODEL_VERSION,
        observation: observation(
          'Tiến một chặng',
          `${s.step}/3`,
          `${next.step}/3`,
          next.events.at(-1)!,
        ),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm cookie và session">
      <h2>Cookie còn, phiên có chắc còn không?</h2>
      <div className="routing-inputs">
        <label>
          Tình huống
          <select value={s.config.mode} onChange={(e) => configure(e.target.value)}>
            <option value="keep">Giữ cookie và phiên hợp lệ</option>
            <option value="drop">Browser không giữ cookie</option>
            <option value="revoke">Server thu hồi phiên</option>
          </select>
        </label>
      </div>
      <p>
        Ba chặng: tạo phiên S1 của An → giữ hoặc thu hồi phiên ở server → gửi GET /lich. Đổi tình
        huống bắt đầu lại. S1 chỉ là nhãn minh họa, không phải session ID an toàn.
      </p>
      <div className="lab-controls">
        <button className="button primary" disabled={s.finished} onClick={run}>
          Tiến một chặng
        </button>
        <button className="button secondary" onClick={() => configure()}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        Chặng {s.step}/3.{' '}
        {s.finished ? `Server nhận diện: ${s.identity}.` : 'Chưa gửi request kiểm tra cuối.'}
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      <dl className="representation-record">
        <dt>Browser giữ</dt>
        <dd>{s.cookie ? 'sid=S1' : 'Không có cookie'}</dd>
        <dt>Server giữ</dt>
        <dd>{s.active ? 'S1 → An' : s.step ? 'S1 không còn hiệu lực' : 'Chưa tạo phiên'}</dd>
      </dl>
      <ol>
        {s.events.map((e, i) => (
          <li key={i}>{e}.</li>
        ))}
      </ol>
      <p className="muted">
        Cookie trong bài chỉ giữ ID, dữ liệu phiên ở server; đây là một cách thiết kế, không phải
        mọi cookie đều là session. Chỉ một browser/server và cookie đúng phạm vi, không cookie
        thật/đăng nhập thật. Không Domain/Path/SameSite, thời hạn, TLS, CSRF/XSS, random ID hoặc
        chính sách bảo mật production; không coi cookie là bằng chứng phân quyền tự đủ.
      </p>
    </section>
  );
}
export function ReverseProxyLab({ progress, onChange }: Props) {
  const s = reverseProxy(progress.lab);
  function configure(patch: Record<string, string> = {}) {
    onChange({
      lab: {
        ...s.config,
        ...patch,
        step: 0,
        modelVersion: WEB_PROTOCOL_MODEL_VERSION,
        observation: '',
      },
      actions: progress.actions + 1,
    });
  }
  function run() {
    const step = s.step + 1;
    const next = reverseProxy({ ...s.config, step, modelVersion: WEB_PROTOCOL_MODEL_VERSION });
    onChange({
      lab: {
        ...s.config,
        step,
        modelVersion: WEB_PROTOCOL_MODEL_VERSION,
        observation: observation('Đi một chặng', `${s.step}/3`, `${step}/3`, next.events.at(-1)!),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm reverse proxy">
      <h2>Một cửa vào, hai dịch vụ phía sau</h2>
      <div className="routing-inputs">
        <label>
          Đường đi
          <select value={s.config.mode} onChange={(e) => configure({ mode: e.target.value })}>
            <option value="proxy">Qua reverse proxy</option>
            <option value="direct">Tới backend trực tiếp</option>
          </select>
        </label>
        <label>
          Tài nguyên
          <select
            value={s.config.resource}
            onChange={(e) => configure({ resource: e.target.value })}
          >
            <option value="class">Lịch lớp /lop</option>
            <option value="image">Ảnh /anh</option>
          </select>
        </label>
      </div>
      <p>
        Browser gọi {s.host}
        {s.path}. Backend phục vụ: {s.backend}. Đổi lựa chọn bắt đầu lại.
      </p>
      <div className="lab-controls">
        <button className="button primary" disabled={s.finished} onClick={run}>
          Đi một chặng
        </button>
        <button className="button secondary" onClick={() => configure()}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        Chặng {s.step}/3. {s.finished ? 'Browser đã nhận 200.' : 'Chưa hoàn tất response.'}
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      <ol>
        {s.events.map((e, i) => (
          <li key={i}>{e}.</li>
        ))}
      </ol>
      <p className="muted">
        Reverse proxy đứng trước dịch vụ phía server. Forward proxy do phía client chọn để chuyển
        request là vai trò khác. Mô hình route cố định theo path, không cache/TLS termination/cân
        bằng tải/tấn công hoặc xử lý lỗi. Số chặng không phải ms, không kết luận proxy luôn nhanh
        hơn hoặc tăng availability.
      </p>
    </section>
  );
}
export function MultiplexLab({ progress, onChange }: Props) {
  const s = multiplexLoss(progress.lab);
  function configure(patch: Record<string, string | boolean> = {}) {
    onChange({
      lab: {
        ...s.config,
        ...patch,
        step: 0,
        modelVersion: WEB_PROTOCOL_MODEL_VERSION,
        observation: '',
      },
      actions: progress.actions + 1,
    });
  }
  function run() {
    const step = s.step + 1;
    const next = multiplexLoss({ ...s.config, step, modelVersion: WEB_PROTOCOL_MODEL_VERSION });
    onChange({
      lab: {
        ...s.config,
        step,
        modelVersion: WEB_PROTOCOL_MODEL_VERSION,
        observation: observation('Xử lý sự kiện', `${s.step}/3`, `${step}/3`, next.events.at(-1)!),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm multiplexing">
      <h2>Mất dữ liệu A, B có phải chờ không?</h2>
      <div className="routing-inputs">
        <label>
          Giao thức
          <select
            value={s.config.protocol}
            onChange={(e) => configure({ protocol: e.target.value })}
          >
            <option value="h3">HTTP/3 trên QUIC</option>
            <option value="h2">HTTP/2 trên TCP</option>
          </select>
        </label>
        <label>
          Mất dữ liệu A
          <select
            value={String(s.config.loss)}
            onChange={(e) => configure({ loss: e.target.value === 'true' })}
          >
            <option value="true">Có mất</option>
            <option value="false">Không mất</option>
          </select>
        </label>
      </div>
      <p>
        Hai response A/B độc lập trên cùng một connection đã thiết lập, header đã giải mã. Dữ liệu A
        nằm trước B trong luồng byte TCP. Ba sự kiện: A tới hoặc mất → B tới → A được phục hồi nếu
        cần. Đổi lựa chọn bắt đầu lại.
      </p>
      <div className="lab-controls">
        <button className="button primary" disabled={s.finished} onClick={run}>
          Xử lý sự kiện
        </button>
        <button className="button secondary" onClick={() => configure()}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        Sự kiện {s.step}/3. Giao cho ứng dụng: A {s.aDelivered ? 'đã có' : 'chưa có'}, B{' '}
        {s.bDelivered ? 'đã có' : 'chưa có'}.
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      <dl className="representation-record">
        <dt>Dữ liệu B đã tới phía nhận</dt>
        <dd>{s.bReceived ? 'Có' : 'Chưa'}</dd>
        <dt>B được giao cho ứng dụng</dt>
        <dd>{s.bDelivered ? 'Có' : 'Chưa'}</dd>
      </dl>
      <ol>
        {s.events.map((e, i) => (
          <li key={i}>{e}.</li>
        ))}
      </ol>
      <p className="muted">
        Chỉ minh họa transport head-of-line blocking do một khoảng dữ liệu A bị thiếu. QUIC vẫn giữ
        thứ tự trong từng stream và dùng chung congestion control; QPACK/header, flow control hoặc
        phụ thuộc ứng dụng vẫn có thể làm chờ. Không mô phỏng handshake, retransmission packet
        number, timer, throughput hoặc tốc độ thật; HTTP/3 không hứa mọi request luôn nhanh hơn.
        HTTP/1.1 thường dùng nhiều connection, không được so ở đây.
      </p>
    </section>
  );
}
