import type { Lesson, LessonProgress } from '@sdl/content-schema';
import {
  restoreCpuIo,
  simulateCpuIo,
  observeCpuIo,
  CPU_IO_MODEL_VERSION,
  cpuIoPhase,
} from '@sdl/simulation-engine';
import { AnnotatedText } from '../lesson-player';
import { ObservationPanel } from './ObservationPanel';
export function CpuIoLab({
  lesson,
  progress,
  onChange,
}: {
  lesson: Lesson;
  progress: LessonProgress;
  onChange(patch: Partial<LessonProgress>): void;
}) {
  const state = restoreCpuIo(progress.lab);
  function configure(patch: LessonProgress['lab']) {
    onChange({
      lab: {
        ...state.config,
        ...patch,
        step: 0,
        modelVersion: CPU_IO_MODEL_VERSION,
        observation: '',
      },
      actions: progress.actions + 1,
    });
  }
  function run(step: number) {
    const next = simulateCpuIo({ ...state.config, step });
    onChange({
      lab: {
        ...state.config,
        step: next.time,
        modelVersion: CPU_IO_MODEL_VERSION,
        observation: JSON.stringify(observeCpuIo(state, next)),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm CPU và I/O">
      <h2>CPU đang bận hay đang chờ?</h2>
      <p>
        <AnnotatedText
          text="Hai việc A/B đến cùng lúc. Một CPU chỉ xử lý một việc mỗi khoảng. Worker giữ việc đến khi xong, kể cả lúc chờ I/O; khi đó CPU có thể làm việc khác đã sẵn sàng."
          terms={lesson.terms}
        />
      </p>
      <div className="routing-inputs">
        <label>
          Loại việc
          <select value={state.config.mode} onChange={(e) => configure({ mode: e.target.value })}>
            <option value="io">Có chờ I/O</option>
            <option value="cpu">Chỉ tính toán CPU</option>
          </select>
        </label>
        <label>
          Số worker
          <select
            value={state.config.workers}
            onChange={(e) => configure({ workers: Number(e.target.value) })}
          >
            <option value={1}>1 worker</option>
            <option value={2}>2 worker</option>
          </select>
        </label>
      </div>
      <p className="muted">
        {state.config.mode === 'io'
          ? 'Mỗi việc: CPU 1 ms → chờ I/O 3 ms → CPU 1 ms. Hai lần chờ độc lập, không tranh một thiết bị chung.'
          : 'Mỗi việc cần 4 ms CPU, không chờ I/O.'}{' '}
        Vẫn chỉ một CPU dù chọn 1 hay 2 worker. Đổi cấu hình bắt đầu lại từ 0 ms và xóa quan sát cũ.
      </p>
      <div className="lab-controls">
        <button
          className="button primary"
          disabled={state.finished}
          onClick={() => run(state.time + 1)}
        >
          Qua 1 ms
        </button>
        <button className="button secondary" disabled={state.finished} onClick={() => run(10)}>
          Chạy đến khi xong
        </button>
        <button className="button secondary" onClick={() => configure({})}>
          Bắt đầu lại
        </button>
      </div>
      <div className="cpu-io-clock">
        <strong>Mốc {state.time} ms</strong>
        <span>
          Đã xong {state.done}/2 · CPU bận {state.busy} ms · nghỉ {state.idle} ms
        </span>
      </div>
      <ul className="cpu-io-jobs" aria-label="Trạng thái tại mốc hiện tại">
        {state.jobs.map((job) => (
          <li key={job.id}>
            <strong>Việc {job.id}</strong>
            <span>
              {cpuIoPhase(job.phase)}
              {job.phase === 'io'
                ? ` · còn ${job.remaining} ms chờ`
                : job.phase === 'first' || job.phase === 'last'
                  ? ` · còn ${job.remaining} ms trong chặng CPU này`
                  : ''}
              {job.doneAt !== null ? ` · từ lúc đến đến xong: ${job.doneAt} ms` : ''}
            </span>
          </li>
        ))}
      </ul>
      <ObservationPanel value={progress.lab['observation']} />
      <div className="feedback" role="status">
        <p>
          {state.finished
            ? `Hai việc hoàn tất ở mốc ${state.time} ms. Thử cấu hình còn lại rồi so thời gian CPU bận và CPU nghỉ.`
            : 'Đang xem trạng thái ở một mốc, không phải thời gian thực. Bấm Qua 1 ms để xem khoảng tiếp theo.'}
        </p>
      </div>
      <details>
        <summary>Xem CPU và hai việc theo từng khoảng</summary>
        {state.timeline.length ? (
          <table className="cpu-io-timeline">
            <caption>Mỗi dòng là 1 ms giả định đã trôi qua</caption>
            <thead>
              <tr>
                <th scope="col">Khoảng</th>
                <th scope="col">CPU</th>
                <th scope="col">Hai việc</th>
              </tr>
            </thead>
            <tbody>
              {state.timeline.map((row) => (
                <tr key={row.start}>
                  <th scope="row">
                    {row.start}–{row.end} ms
                  </th>
                  <td>{row.cpu ? `Việc ${row.cpu}` : 'Nghỉ'}</td>
                  <td>
                    {row.states.map((j) => (
                      <span key={j.id}>
                        {j.id}: {j.text}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa chạy khoảng nào. Việc sẵn sàng vẫn cần được CPU chọn.</p>
        )}
      </details>
      <p className="muted">
        Một CPU, hai việc cố định, ưu tiên A khi nhiều việc sẵn sàng; không tính phí chuyển luồng
        hay hàng chờ thiết bị. Worker trong bài dùng I/O blocking. Đây chưa phải event loop hoặc I/O
        non-blocking; số ms không phải benchmark.
      </p>
    </section>
  );
}
