import type { LessonProgress } from '@sdl/content-schema';
import { normalizeTls, simulateTls, observeTls } from '@sdl/simulation-engine';
import { ObservationPanel } from './ObservationPanel';
export function TlsLab({
  progress,
  onChange,
}: {
  progress: LessonProgress;
  onChange(patch: Partial<LessonProgress>): void;
}) {
  const config = normalizeTls(progress.lab);
  const result = simulateTls(progress.lab, progress.lab['ran'] === true);
  function change(patch: LessonProgress['lab']) {
    onChange({
      lab: { ...progress.lab, ...patch, ran: false, observation: '' },
      actions: progress.actions + 1,
    });
  }
  function run() {
    const next = simulateTls(progress.lab);
    onChange({
      lab: { ...progress.lab, ran: true, observation: JSON.stringify(observeTls(result, next)) },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm HTTPS và TLS">
      <h2>Ai nhìn thấy lịch học?</h2>
      <p>
        Địa chỉ đang mở: lich.truong.example. Máy trường gửi “Phòng 201”. Người kiểm soát đường
        truyền có thể thử nghe lén hoặc sửa dữ liệu.
      </p>
      <div className="routing-inputs">
        <label>
          Kênh truyền
          <select
            value={config.secure ? 'https' : 'http'}
            onChange={(e) => change({ secure: e.target.value === 'https' })}
          >
            <option value="https">HTTPS · có TLS</option>
            <option value="http">HTTP · không có TLS</option>
          </select>
        </label>
        <label>
          Chứng chỉ máy trường
          <select
            disabled={!config.secure}
            value={config.certificate}
            onChange={(e) => change({ certificate: e.target.value })}
          >
            <option value="valid">Hợp lệ theo giả định</option>
            <option value="wrong-name">Sai tên miền</option>
            <option value="expired">Hết hạn</option>
            <option value="untrusted">Chuỗi không được tin cậy</option>
          </select>
        </label>
        <label>
          Can thiệp trên đường
          <select value={config.attack} onChange={(e) => change({ attack: e.target.value })}>
            <option value="none">Không can thiệp</option>
            <option value="listen">Thử nghe lén</option>
            <option value="tamper">Thử sửa thành phòng 999</option>
          </select>
        </label>
      </div>
      <div className="lab-controls">
        <button className="button primary" onClick={run}>
          Gửi lịch
        </button>
        <button
          className="button secondary"
          onClick={() => change({ secure: true, certificate: 'valid', attack: 'none' })}
        >
          Đặt lại
        </button>
      </div>
      <ol className="routing-trace" aria-label="Ba góc nhìn">
        <li>
          <strong>Máy trường</strong>
          <span>Phòng 201 · nội dung gốc</span>
        </li>
        <li>
          <strong>Người trên mạng</strong>
          <span>{result.observer}</span>
        </li>
        <li>
          <strong>Trình duyệt của bạn</strong>
          <span>{result.browser}</span>
        </li>
      </ol>
      <ObservationPanel value={progress.lab['observation']} />
      <div className="feedback" role="status">
        <p>{result.outcome}</p>
      </div>
      <details>
        <summary>Xem các bước và lý do</summary>
        <ol>
          {result.trace.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </details>
      <p className="muted">
        Các bước được gom để giải thích, không phải thứ tự gói TLS đầy đủ. Không thực hiện mã hóa
        thật. HTTPS bảo vệ kênh tới đầu cuối TLS; không xác nhận lịch do máy trường viết là đúng hay
        website không lừa đảo.
      </p>
    </section>
  );
}
