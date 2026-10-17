import type { Lesson, LessonProgress } from '@sdl/content-schema';
import { priorityHeap, HEAP_MODEL_VERSION, type HeapJob } from '@sdl/simulation-engine';
import { ObservationPanel } from './ObservationPanel';
const label = (job: HeapJob | undefined) =>
  job ? `${job.id} · ${job.priority}` : 'Không còn việc';
const positions = [
  [140, 26],
  [76, 85],
  [204, 85],
  [28, 144],
  [100, 144],
  [180, 144],
  [252, 144],
] as const;

export function PriorityHeapLab({
  progress,
  onChange,
}: {
  lesson: Lesson;
  progress: LessonProgress;
  onChange(patch: Partial<LessonProgress>): void;
}) {
  const state = priorityHeap(progress.lab);
  function configure(method = state.config.method) {
    onChange({
      lab: { method, step: 0, modelVersion: HEAP_MODEL_VERSION, observation: '' },
      actions: progress.actions + 1,
    });
  }
  function run(step: number) {
    const next = priorityHeap({ ...state.config, step, modelVersion: HEAP_MODEL_VERSION });
    onChange({
      lab: {
        ...state.config,
        step,
        modelVersion: HEAP_MODEL_VERSION,
        observation: JSON.stringify({
          schemaVersion: 1,
          action: step - state.step === 1 ? 'Lấy một việc' : 'Lấy hết việc còn chờ',
          rows: [
            { label: 'Đã lấy', before: `${state.step} việc`, after: `${next.step} việc` },
            {
              label: 'Còn chờ',
              before: `${state.waiting.length} việc`,
              after: `${next.waiting.length} việc`,
            },
            { label: 'Đầu tiếp theo', before: label(state.next), after: label(next.next) },
          ],
          reason:
            state.config.method === 'heap'
              ? 'Mỗi lần lấy gốc nhỏ nhất; nếu còn việc, đưa nút cuối lên gốc rồi đổi với con nhỏ hơn khi cần để khôi phục heap.'
              : 'FIFO lấy việc đến trước trước, không chọn theo số ưu tiên.',
        }),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm hàng đợi ưu tiên">
      <h2>Việc nào được lấy ra tiếp theo?</h2>
      <p>
        Bảy việc in đã đến đủ. Ký hiệu A · 4 là việc A có mức 4; trong bài, số nhỏ được ưu tiên
        trước. Thứ tự đến: {state.arrivals.map(label).join(' → ')}.
      </p>
      <div className="routing-inputs">
        <label>
          Cách chọn việc
          <select
            value={state.config.method}
            onChange={(e) => configure(e.target.value === 'fifo' ? 'fifo' : 'heap')}
          >
            <option value="heap">Min-heap: số nhỏ trước</option>
            <option value="fifo">FIFO: đến trước trước</option>
          </select>
        </label>
      </div>
      <p className="muted">
        Đổi cách chọn bắt đầu lại và xóa quan sát cũ. Mỗi bước lấy một việc và sửa heap xong, không
        phải một phép so hoặc thời gian in. Chưa có việc mới đến trong lượt thử.
      </p>
      <div className="lab-controls">
        <button
          className="button primary"
          disabled={state.finished}
          onClick={() => run(state.step + 1)}
        >
          Lấy một việc
        </button>
        <button className="button secondary" disabled={state.finished} onClick={() => run(7)}>
          Lấy hết việc
        </button>
        <button className="button secondary" onClick={() => configure()}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        Đã lấy {state.step} việc.{' '}
        {state.finished ? 'Không còn việc chờ.' : `Tiếp theo: ${label(state.next)}.`}
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      <p>
        <strong>Thứ tự đã lấy:</strong>{' '}
        {state.history.map((r) => label(r.removed)).join(' → ') || 'Chưa lấy việc nào.'}
      </p>
      {state.waiting.length > 0 && (
        <>
          {state.config.method === 'heap' && (
            <figure className="search-tree-figure priority-heap-figure">
              <svg
                viewBox="0 0 280 176"
                role="img"
                aria-label={`Min-heap còn ${state.waiting.length} việc, gốc ${label(state.next)}. Danh sách theo tầng bên dưới.`}
              >
                {state.waiting.slice(1).map((job, offset) => {
                  const i = offset + 1;
                  const parent = Math.floor((i - 1) / 2);
                  return (
                    <line
                      key={job.id}
                      x1={positions[parent]![0]}
                      y1={positions[parent]![1]}
                      x2={positions[i]![0]}
                      y2={positions[i]![1]}
                    />
                  );
                })}
                {state.waiting.map((job, i) => (
                  <g key={job.id} transform={`translate(${positions[i]!.join(' ')})`}>
                    <circle r="22" className={i === 0 ? 'examined' : ''} />
                    <text textAnchor="middle" dy=".35em">
                      {label(job)}
                    </text>
                  </g>
                ))}
              </svg>
              <figcaption>
                Gốc {label(state.next)} có số nhỏ nhất. Cha không lớn hơn con; hai nhánh con không
                cần sắp trái nhỏ/phải lớn như BST.
              </figcaption>
            </figure>
          )}
          <h3>
            {state.config.method === 'heap'
              ? 'Mảng theo tầng của heap'
              : 'Hàng chờ theo thứ tự đến'}
          </h3>
          {state.config.method === 'heap' && (
            <p className="muted">
              Đọc từ gốc, rồi từng tầng từ trái sang phải. Đây chưa phải thứ tự lấy hết việc.
            </p>
          )}
          <ol
            role="list"
            className="heap-array"
            aria-label={state.config.method === 'heap' ? 'Mảng theo tầng' : 'Hàng FIFO'}
          >
            {state.waiting.map((job) => (
              <li key={job.id}>{label(job)}</li>
            ))}
          </ol>
        </>
      )}
      <details>
        <summary>Xem lịch sử lấy việc</summary>
        <ol>
          {state.history.map((event, i) => (
            <li key={event.removed.id}>
              <p>
                Lần {i + 1}: lấy {label(event.removed)}.
              </p>
              {state.config.method === 'heap' ? (
                <p>
                  {event.replacement
                    ? `Đưa ${label(event.replacement)} từ cuối lên gốc. `
                    : 'Heap đã hết việc. '}
                  {event.swaps
                    .map((swap) => `Đổi ${label(swap.parent)} với con ${label(swap.child)}. `)
                    .join('')}
                  {event.replacement && !event.swaps.length ? 'Không cần đổi cha/con.' : ''}
                </p>
              ) : (
                <p>Lấy đầu hàng và giữ thứ tự đến của các việc còn lại.</p>
              )}
            </li>
          ))}
        </ol>
        {!state.step && <p>Chưa lấy việc nào.</p>}
      </details>
      <p className="muted">
        Heap là một cách cài hàng đợi ưu tiên, không phải mảng đã sắp hoặc BST. Bài không đo tốc độ,
        thời gian chờ hay công bằng; không có mức trùng, việc mới, đổi mức ưu tiên, nhiều worker
        hoặc lỗi máy in. Đổi cách chọn chỉ thay quy tắc lấy trong cùng bộ việc giả định.
      </p>
    </section>
  );
}
