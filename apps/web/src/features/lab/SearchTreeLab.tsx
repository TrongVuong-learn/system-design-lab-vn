import type { Lesson, LessonProgress } from '@sdl/content-schema';
import { searchTree, TREE_MODEL_VERSION } from '@sdl/simulation-engine';
import { ObservationPanel } from './ObservationPanel';

export function SearchTreeLab({
  progress,
  onChange,
}: {
  lesson: Lesson;
  progress: LessonProgress;
  onChange(patch: Partial<LessonProgress>): void;
}) {
  const state = searchTree(progress.lab);
  function configure(patch: LessonProgress['lab']) {
    onChange({
      lab: {
        ...state.config,
        ...patch,
        step: 0,
        modelVersion: TREE_MODEL_VERSION,
        observation: '',
      },
      actions: progress.actions + 1,
    });
  }
  function run(step: number) {
    const next = searchTree({ ...state.config, step, modelVersion: TREE_MODEL_VERSION });
    onChange({
      lab: {
        ...state.config,
        step: next.step,
        modelVersion: TREE_MODEL_VERSION,
        observation: JSON.stringify({
          schemaVersion: 1,
          action: 'Tra mã trên cây',
          rows: [
            { label: 'Nút đã xét', before: `${state.step} nút`, after: `${next.step} nút` },
            {
              label: 'Kết quả',
              before: 'Chưa kết luận',
              after: next.finished
                ? next.found
                  ? 'Tìm thấy'
                  : 'Không có mã này'
                : 'Chưa kết luận',
            },
          ],
          reason: next.finished
            ? next.found
              ? 'Mã đầy đủ trùng với nút vừa xét nên dừng.'
              : 'Nhánh cần đi đã trống; trong cây này không có mã cần tìm.'
            : 'So mã để chọn nhánh trái nhỏ hơn hoặc nhánh phải lớn hơn; chưa cần xét nhánh còn lại.',
        }),
      },
      actions: progress.actions + 1,
    });
  }
  const positions: Record<number, [number, number]> =
    state.config.shape === 'balanced'
      ? {
          8: [140, 26],
          4: [76, 85],
          12: [204, 85],
          2: [28, 144],
          6: [100, 144],
          10: [180, 144],
          14: [252, 144],
        }
      : Object.fromEntries(state.nodes.map((n, i) => [n.key, [140, 26 + i * 55]]));
  const examined = state.trace.map((r) => r.key);
  return (
    <section className="lab-panel" aria-label="Thí nghiệm cây tìm kiếm">
      <h2>Cùng dữ liệu, đường tìm có giống nhau?</h2>
      <p>
        Bảy mã sách: 2, 4, 6, 8, 10, 12, 14. Bắt đầu ở nút gốc {state.root} để tìm mã{' '}
        <strong>{state.wanted}</strong>. Ở mỗi nút, toàn bộ cây con trái có mã nhỏ hơn; toàn bộ cây
        con phải có mã lớn hơn nút đó.
      </p>
      <div className="routing-inputs">
        <label>
          Hình dạng cây
          <select value={state.config.shape} onChange={(e) => configure({ shape: e.target.value })}>
            <option value="balanced">Cân đối dựng sẵn</option>
            <option value="skewed">Lệch phải dựng sẵn</option>
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
            <option value="missing">Mã 9 (không có)</option>
          </select>
        </label>
      </div>
      <p className="muted">
        Đổi cấu hình bắt đầu lại và xóa quan sát cũ. Một bước là xét một nút, không phải thời gian
        ms hoặc số lệnh CPU. Hai cây đã dựng sẵn, không có thao tác tự cân bằng.
      </p>
      <div className="lab-controls">
        <button
          className="button primary"
          disabled={state.finished}
          onClick={() => run(state.step + 1)}
        >
          Xét một nút
        </button>
        <button className="button secondary" disabled={state.finished} onClick={() => run(7)}>
          Tra đến khi xong
        </button>
        <button className="button secondary" onClick={() => configure({})}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        Đã xét {state.step} nút.{' '}
        {state.finished
          ? state.found
            ? `Tìm thấy mã ${state.wanted}.`
            : `Không có mã ${state.wanted}.`
          : 'Chưa kết luận.'}
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      <figure className="search-tree-figure">
        <svg
          viewBox={`0 0 280 ${state.config.shape === 'balanced' ? 176 : 382}`}
          role="img"
          aria-label={`Cây ${state.config.shape === 'balanced' ? 'cân đối' : 'lệch phải'}, gốc ${state.root}. Đã xét: ${examined.join(', ') || 'chưa có'}. Xem đường đi bằng chữ bên dưới.`}
        >
          {state.nodes.flatMap((node) =>
            [node.left, node.right]
              .filter((key) => key !== undefined)
              .map((key) => (
                <line
                  key={`${node.key}-${key}`}
                  x1={positions[node.key]![0]}
                  y1={positions[node.key]![1]}
                  x2={positions[key]![0]}
                  y2={positions[key]![1]}
                />
              )),
          )}
          {state.nodes.map((node) => (
            <g key={node.key} transform={`translate(${positions[node.key]!.join(' ')})`}>
              <circle r="20" className={examined.includes(node.key) ? 'examined' : ''} />
              <text textAnchor="middle" dy=".35em">
                {node.key}
              </text>
            </g>
          ))}
        </svg>
        <figcaption>
          {state.config.shape === 'balanced'
            ? 'Nhánh trái đi xuống bên trái, nhánh phải đi xuống bên phải.'
            : 'Cây chỉ có nhánh phải. Các nhánh phải được vẽ thẳng xuống để vừa điện thoại.'}{' '}
          Đã xét: {examined.join(' → ') || 'chưa có nút nào'}.
        </figcaption>
      </figure>
      <details>
        <summary>Xem đường đi bằng chữ</summary>
        <ol>
          {state.trace.map((row) => (
            <li key={row.key}>
              So {state.wanted} với {row.key}:{' '}
              {row.direction === 'match'
                ? 'bằng nhau, tìm thấy và dừng.'
                : `${row.direction === 'left' ? 'nhỏ hơn, sang trái' : 'lớn hơn, sang phải'}${row.next === undefined ? '; nhánh trống, dừng vì không có mã này.' : ` tới nút ${row.next}.`}`}
            </li>
          ))}
        </ol>
        {!state.step && <p>Chưa xét nút nào.</p>}
      </details>
      <p className="muted">
        Cùng bảy khóa nhưng đường tìm phụ thuộc hình dạng và mã cần tìm. Cây lệch vẫn đúng quy tắc
        tìm kiếm; không bảo đảm lần nào cũng chia đôi số nút còn lại. Bài chưa mô phỏng chèn/xóa,
        xoay cây, heap, B-tree hay đọc đĩa của database.
      </p>
    </section>
  );
}
