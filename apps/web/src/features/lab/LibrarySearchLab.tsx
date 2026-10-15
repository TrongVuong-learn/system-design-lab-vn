import type { Lesson, LessonProgress } from '@sdl/content-schema';
import { librarySearch, SEARCH_MODEL_VERSION } from '@sdl/simulation-engine';
import { ObservationPanel } from './ObservationPanel';
export function LibrarySearchLab({
  progress,
  onChange,
}: {
  lesson: Lesson;
  progress: LessonProgress;
  onChange(p: Partial<LessonProgress>): void;
}) {
  const state = librarySearch(progress.lab);
  function configure(patch: LessonProgress['lab']) {
    onChange({
      lab: {
        ...state.config,
        ...patch,
        step: 0,
        modelVersion: SEARCH_MODEL_VERSION,
        observation: '',
      },
      actions: progress.actions + 1,
    });
  }
  function run(step: number) {
    const next = librarySearch({ ...state.config, step, modelVersion: SEARCH_MODEL_VERSION });
    onChange({
      lab: {
        ...state.config,
        step: next.step,
        modelVersion: SEARCH_MODEL_VERSION,
        observation: JSON.stringify({
          schemaVersion: 1,
          action: 'Tìm trong danh mục',
          rows: [
            { label: 'Số mục đã xem', before: `${state.step} mục`, after: `${next.step} mục` },
            {
              label: 'Kết quả',
              before: state.finished ? 'Đã kết thúc' : 'Chưa kết luận',
              after: next.finished
                ? next.found
                  ? 'Tìm thấy'
                  : 'Không có mã này'
                : 'Chưa kết luận',
            },
          ],
          reason: next.trace.at(-1)?.reason ?? 'Chưa xem mục nào.',
        }),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Tìm mã sách trong mảng">
      <h2>Có cần xem mọi mã sách?</h2>
      <p>
        Danh mục đã sắp tăng: 2, 4, 6, …, {state.config.size * 2}. Mỗi vị trí truy cập trực tiếp
        được. Tìm mã <strong>{state.wanted}</strong>; một bước là xem một mục, không phải một mili
        giây.
      </p>
      <div className="routing-inputs">
        <label>
          Cách tìm
          <select
            value={state.config.method}
            onChange={(e) => configure({ method: e.target.value })}
          >
            <option value="linear">Từng mục</option>
            <option value="binary">Chia đôi</option>
          </select>
        </label>
        <label>
          Số sách
          <select
            value={state.config.size}
            onChange={(e) => configure({ size: Number(e.target.value) })}
          >
            {[8, 32, 128].map((n) => (
              <option key={n} value={n}>
                {n} sách
              </option>
            ))}
          </select>
        </label>
        <label>
          Mã cần tìm
          <select
            value={state.config.target}
            onChange={(e) => configure({ target: e.target.value })}
          >
            <option value="first">Mã đầu</option>
            <option value="last">Mã cuối</option>
            <option value="missing">Mã không có</option>
          </select>
        </label>
      </div>
      <p className="muted">
        Đổi cách tìm, số sách hoặc mục tiêu sẽ bắt đầu lại và xóa quan sát cũ.
      </p>
      <div className="lab-controls">
        <button
          className="button primary"
          disabled={state.finished}
          onClick={() => run(state.step + 1)}
        >
          Xem một mục
        </button>
        <button
          className="button secondary"
          disabled={state.finished}
          onClick={() => run(state.config.size)}
        >
          Tìm đến khi xong
        </button>
        <button className="button secondary" onClick={() => configure({})}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        Đã xem {state.step} mục.{' '}
        {state.finished
          ? state.found
            ? `Tìm thấy mã ${state.wanted}.`
            : `Không có mã ${state.wanted} trong danh mục.`
          : `Chưa kết luận; phạm vi còn lại: vị trí ${state.low}–${state.high}.`}
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      <details>
        <summary>Xem các bước tìm kiếm</summary>
        <ol>
          {state.trace.map((row, i) => (
            <li key={i}>
              Vị trí {row.position}, mã {row.value}. {row.reason}
              {i === state.trace.length - 1 && !state.finished
                ? ` Còn vị trí ${row.low}–${row.high}.`
                : ''}
            </li>
          ))}
        </ol>
        {!state.step && <p>Chưa xem mục nào.</p>}
      </details>
      <p className="muted">
        Chia đôi cần mảng đã sắp tăng; bài không tính chi phí sắp xếp, thêm sách, bộ nhớ hay đọc
        disk. Từng mục ở đây chỉ dừng khi thấy hoặc hết danh mục. Số mục ít hơn không quy đổi trực
        tiếp thành số ms nhanh hơn. Thử mã đầu để thấy từng mục cũng có thể tìm được ngay.
      </p>
    </section>
  );
}
