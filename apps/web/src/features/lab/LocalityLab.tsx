import type { LessonProgress } from '@sdl/content-schema';
import { memoryLocality, LOCALITY_MODEL_VERSION } from '@sdl/simulation-engine';
import { ObservationPanel } from './ObservationPanel';
export function LocalityLab({
  progress,
  onChange,
}: {
  progress: LessonProgress;
  onChange(patch: Partial<LessonProgress>): void;
}) {
  const state = memoryLocality(progress.lab);
  function configure(
    pattern: string = state.config.pattern,
    blockSize: number = state.config.blockSize,
  ) {
    onChange({
      lab: { pattern, blockSize, step: 0, modelVersion: LOCALITY_MODEL_VERSION, observation: '' },
      actions: progress.actions + 1,
    });
  }
  function run(step: number) {
    const next = memoryLocality({ ...state.config, step, modelVersion: LOCALITY_MODEL_VERSION });
    onChange({
      lab: {
        ...state.config,
        step,
        modelVersion: LOCALITY_MODEL_VERSION,
        observation: JSON.stringify({
          schemaVersion: 1,
          action: step - state.step === 1 ? 'Đọc một ô' : 'Đọc hết lượt',
          rows: [
            { label: 'Đọc từ cache', before: `${state.hits} lượt`, after: `${next.hits} lượt` },
            { label: 'Nạp khối', before: `${state.loads} lượt`, after: `${next.loads} lượt` },
          ],
          reason:
            'Cache chỉ giữ một khối. Nếu ô cần đọc nằm trong khối đang giữ thì dùng lại; nếu không thì nạp khối chứa ô đó và thay khối cũ.',
        }),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm đọc bộ nhớ">
      <h2>Đọc ô gần nhau có ích gì?</h2>
      <p>
        Có tám ô đánh số 0–7. Cache bắt đầu trống và chỉ giữ một khối. Mỗi bước đọc một ô theo thứ
        tự bên dưới.
      </p>
      <div className="routing-inputs">
        <label>
          Thứ tự đọc
          <select value={state.config.pattern} onChange={(e) => configure(e.target.value)}>
            <option value="sequential">Liền nhau: 0, 1, 2, 3…</option>
            <option value="interleaved">Xen kẽ: 0, 4, 1, 5…</option>
            <option value="repeated">Lặp lại ô 0</option>
          </select>
        </label>
        <label>
          Kích thước khối
          <select
            value={state.config.blockSize}
            onChange={(e) => configure(state.config.pattern, Number(e.target.value))}
          >
            <option value="4">4 ô mỗi khối</option>
            <option value="1">1 ô mỗi khối</option>
          </select>
        </label>
      </div>
      <p className="muted">
        Đổi lựa chọn bắt đầu lại từ cache trống. Một khối 4 ô cũng có sức chứa lớn hơn một khối 1 ô;
        đây không phải so sánh cùng dung lượng cache.
      </p>
      <p>
        <strong>Thứ tự cần đọc:</strong> {state.addresses.join(' → ')}.
      </p>
      <div className="lab-controls">
        <button
          className="button primary"
          disabled={state.finished}
          onClick={() => run(state.step + 1)}
        >
          Đọc một ô
        </button>
        <button className="button secondary" disabled={state.finished} onClick={() => run(8)}>
          Đọc hết lượt
        </button>
        <button className="button secondary" onClick={() => configure()}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        Đã đọc {state.step}/8 ô. Đọc từ cache: {state.hits} lượt. Nạp khối: {state.loads} lượt.
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      <h3>Khối hiện có trong cache</h3>
      <p>
        {state.cachedBlock === null
          ? 'Cache trống.'
          : `Đang giữ ô ${state.cachedBlock * state.config.blockSize}–${(state.cachedBlock + 1) * state.config.blockSize - 1}.`}
      </p>
      <ol role="list" className="locality-memory" aria-label="Tám ô bộ nhớ">
        {Array.from({ length: 8 }, (_, address) => (
          <li
            key={address}
            className={
              state.cachedBlock === Math.floor(address / state.config.blockSize) ? 'resident' : ''
            }
          >
            <strong>Ô {address}</strong>
            <span>
              {state.cachedBlock === Math.floor(address / state.config.blockSize)
                ? 'Trong cache'
                : 'Ở nguồn'}
            </span>
          </li>
        ))}
      </ol>
      <details>
        <summary>Xem từng lượt đọc</summary>
        <ol>
          {state.trace.map((event, i) => (
            <li key={i}>
              Lượt {i + 1}: ô {event.address};{' '}
              {event.hit
                ? 'đọc từ cache'
                : `nạp khối chứa ô ${event.block * state.config.blockSize}–${(event.block + 1) * state.config.blockSize - 1}${event.evicted === null ? ' vào cache trống' : ', thay khối cũ'}`}
              .
            </li>
          ))}
        </ol>
        {!state.step && <p>Chưa đọc ô nào.</p>}
      </details>
      <p className="muted">
        Chỉ đếm lượt nạp khối và lượt đọc trúng cache, không đo ms hoặc tốc độ CPU. Chỉ một khối,
        chỉ đọc; chưa có nhiều tầng cache, prefetch, ghi dữ liệu hoặc chính sách thay nhiều khối.
        Các ô là đơn vị giả định, không phải địa chỉ byte thật.
      </p>
    </section>
  );
}
