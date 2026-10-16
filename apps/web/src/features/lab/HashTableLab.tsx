import type { Lesson, LessonProgress } from '@sdl/content-schema';
import { hashTable, HASH_MODEL_VERSION } from '@sdl/simulation-engine';
import { ObservationPanel } from './ObservationPanel';
export function HashTableLab({
  progress,
  onChange,
}: {
  lesson: Lesson;
  progress: LessonProgress;
  onChange(p: Partial<LessonProgress>): void;
}) {
  const state = hashTable(progress.lab);
  function configure(patch: LessonProgress['lab']) {
    onChange({
      lab: {
        ...state.config,
        ...patch,
        step: 0,
        modelVersion: HASH_MODEL_VERSION,
        observation: '',
      },
      actions: progress.actions + 1,
    });
  }
  function run(step: number) {
    const next = hashTable({ ...state.config, step, modelVersion: HASH_MODEL_VERSION });
    onChange({
      lab: {
        ...state.config,
        step: next.step,
        modelVersion: HASH_MODEL_VERSION,
        observation: JSON.stringify({
          schemaVersion: 1,
          action: 'Tra mã sách',
          rows: [
            { label: 'Khóa đã so', before: `${state.step} khóa`, after: `${next.step} khóa` },
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
          reason: next.finished
            ? next.found
              ? 'Chỉ tìm thấy khi khóa đầy đủ trùng mục tiêu.'
              : 'Đã hết các khóa cần xét mà không có khóa trùng.'
            : 'Khóa vừa so chưa trùng; cần xem tiếp, không kết luận chỉ dựa vào ngăn.',
        }),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm hash table">
      <h2>Cùng ngăn có phải cùng mã?</h2>
      <p>
        Bốn mã sách: 2, 6, 10, 14. Tìm mã <strong>{state.wanted}</strong>. Hash chọn ngăn bằng phần
        dư khi chia mã cho số ngăn: {state.wanted} chia {state.config.count} dư {state.bucket}.
      </p>
      <div className="routing-inputs">
        <label>
          Cách tìm
          <select
            value={state.config.method}
            onChange={(e) => configure({ method: e.target.value })}
          >
            <option value="hash">Theo ngăn hash</option>
            <option value="linear">Từng khóa</option>
          </select>
        </label>
        <label>
          Số ngăn
          <select
            value={state.config.count}
            onChange={(e) => configure({ count: Number(e.target.value) })}
          >
            <option value={4}>4 ngăn</option>
            <option value={8}>8 ngăn</option>
          </select>
        </label>
        <label>
          Mã cần tìm
          <select
            value={state.config.target}
            onChange={(e) => configure({ target: e.target.value })}
          >
            <option value="last">Mã 14</option>
            <option value="first">Mã 2</option>
            <option value="missing">Mã 18 (không có)</option>
          </select>
        </label>
      </div>
      <p className="muted">
        Đổi cấu hình bắt đầu lại và xóa quan sát cũ. Đếm một bước mỗi lần so một khóa; chưa tính
        công dựng bảng hoặc tính hash.
      </p>
      <div className="lab-controls">
        <button
          className="button primary"
          disabled={state.finished}
          onClick={() => run(state.step + 1)}
        >
          So một khóa
        </button>
        <button className="button secondary" disabled={state.finished} onClick={() => run(4)}>
          Tra đến khi xong
        </button>
        <button className="button secondary" onClick={() => configure({})}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        Đã so {state.step} khóa.{' '}
        {state.finished
          ? state.found
            ? `Tìm thấy mã ${state.wanted}.`
            : `Không có mã ${state.wanted}.`
          : 'Chưa kết luận.'}
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      <table className="hash-buckets">
        <caption>Các ngăn và khóa trong chuỗi; xét từ trái sang phải</caption>
        <thead>
          <tr>
            <th scope="col">Ngăn</th>
            <th scope="col">Khóa đã lưu</th>
          </tr>
        </thead>
        <tbody>
          {state.buckets.map((b) => (
            <tr key={b.index}>
              <th scope="row">
                {b.index}
                {state.config.method === 'hash' && b.index === state.bucket ? ' · đang tra' : ''}
              </th>
              <td>{b.keys.length ? b.keys.join(' → ') : 'Trống'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <details>
        <summary>Xem các khóa đã so</summary>
        <ol>
          {state.trace.map((row) => (
            <li key={row.key}>
              So mã {row.key} với {state.wanted}: {row.match ? 'trùng, dừng lại.' : 'khác.'}
            </li>
          ))}
        </ol>
        {!state.step && <p>Chưa so khóa nào.</p>}
      </details>
      <p className="muted">
        Chọn Từng khóa để so cả danh mục, không dùng ngăn. Bảng đã dựng sẵn và không có ghi/xóa đồng
        thời. Cách chia dư này cố ý đơn giản để thấy va chạm; không là mã hóa, hash bảo mật hoặc bảo
        đảm luôn tìm trong một bước. Ngăn nhiều hơn tốn chỗ và không giúp mọi truy vấn.
      </p>
    </section>
  );
}
