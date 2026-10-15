import type { Lesson, LessonProgress } from '@sdl/content-schema';
import {
  concurrencyStep,
  restoreConcurrency,
  observeConcurrency,
  CONCURRENCY_MODEL_VERSION,
  type Actor,
} from '@sdl/simulation-engine';
import { AnnotatedText } from '../lesson-player';
import { ObservationPanel } from './ObservationPanel';
const actors: Actor[] = ['a', 'b'];
export function ConcurrencyLab({
  lesson,
  progress,
  onChange,
}: {
  lesson: Lesson;
  progress: LessonProgress;
  onChange(patch: Partial<LessonProgress>): void;
}) {
  const state = restoreConcurrency(progress.lab);
  const finished = state.stages.a === 2 && state.stages.b === 2;
  function start(locked: boolean) {
    onChange({
      lab: { locked, modelVersion: CONCURRENCY_MODEL_VERSION, schedule: '[]', observation: '' },
      actions: progress.actions + 1,
    });
  }
  function step(actor: Actor) {
    const next = concurrencyStep(state, actor);
    onChange({
      lab: {
        locked: state.locked,
        modelVersion: CONCURRENCY_MODEL_VERSION,
        schedule: JSON.stringify(next.state.schedule),
        observation: JSON.stringify(observeConcurrency(state, next.state, next.reason)),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm concurrency">
      <h2>Hai lượt cộng, vì sao chỉ tăng một?</h2>
      <p>
        <AnnotatedText
          text="Một máy chủ có hai thread A/B trong cùng process, cùng sửa bộ đếm trong RAM. Mỗi thread cần đọc số chung, rồi ghi số đã đọc +1. Bạn chọn từng bước trên một CPU mô phỏng."
          terms={lesson.terms}
        />
      </p>
      <div className="concurrency-shared">
        <span>Số đăng ký chung</span>
        <strong>{state.shared}</strong>
        <p>Bắt đầu 30; mong đợi 32 sau hai lượt cộng 1.</p>
      </div>
      <label className="toggle">
        <input type="checkbox" checked={state.locked} onChange={(e) => start(e.target.checked)} />
        <span>Dùng cùng một khóa cho cả đọc–tăng–ghi</span>
      </label>
      <p className="muted">
        Đổi chế độ bắt đầu lại từ 30, xóa lượt thử và quan sát cũ.{' '}
        {state.locked
          ? state.owner
            ? `Luồng ${state.owner.toUpperCase()} đang giữ khóa.`
            : 'Khóa đang rảnh.'
          : 'Hiện chưa dùng khóa.'}
      </p>
      <div className="concurrency-workers">
        {actors.map((actor) => {
          const name = actor.toUpperCase(),
            stage = state.stages[actor],
            waiting = state.locked && state.owner !== null && state.owner !== actor;
          return (
            <section className="concurrency-worker" aria-label={`Luồng ${name}`} key={actor}>
              <h3>Luồng {name}</h3>
              <p>
                Đã đọc: <strong>{state.locals[actor] ?? 'Chưa đọc'}</strong>
              </p>
              <p>
                {stage === 2
                  ? 'Đã ghi xong lượt của mình.'
                  : waiting
                    ? `Chờ ${state.owner!.toUpperCase()} trả khóa; chưa được đọc.`
                    : stage === 0
                      ? 'Bước tiếp: đọc số chung.'
                      : `Bước tiếp: ghi ${state.locals[actor]} +1.`}
              </p>
              <button
                className="button secondary"
                disabled={stage === 2}
                onClick={() => step(actor)}
              >
                {stage === 2
                  ? `${name} đã ghi xong`
                  : stage === 0
                    ? `${name} đọc số chung`
                    : `${name} ghi số đã đọc +1`}
              </button>
            </section>
          );
        })}
      </div>
      <div className="lab-controls">
        <button className="button secondary" onClick={() => start(state.locked)}>
          Bắt đầu lại lượt thử
        </button>
      </div>
      <ObservationPanel value={progress.lab['observation']} />
      <div className="feedback" role="status">
        <p>
          {finished
            ? state.shared === 32
              ? 'Kết quả 32: đủ hai lượt tăng. So thứ tự đọc và ghi trong trace.'
              : 'Kết quả 31: một cập nhật bị ghi đè. Cả hai đã đọc 30 rồi đều ghi 31.'
            : `Đã ghi ${actors.filter((a) => state.stages[a] === 2).length}/2 lượt. Chọn bước tiếp ở A hoặc B.`}
        </p>
      </div>
      <details>
        <summary>Xem thứ tự đọc và ghi</summary>
        {state.trace.length ? (
          <ol className="concurrency-trace">
            {state.trace.map((event, i) => (
              <li key={i}>
                <strong>
                  Bước {i + 1} · {event.actor.toUpperCase()}
                </strong>
                <span>
                  {event.text} Số chung: {event.shared}.
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p>Chưa có bước đọc hoặc ghi nào. Thử cho A đọc, rồi B đọc trước khi ghi.</p>
        )}
      </details>
      <p className="muted">
        Mỗi lần bấm là một thao tác giả định, không phải một mili giây. Chờ khóa chưa tính là
        đọc/ghi. Khóa lý tưởng chỉ bảo vệ biến chung này khi cả hai cùng tuân theo; không mô phỏng
        mutex hệ điều hành, JavaScript runtime, database hay nhiều máy.
      </p>
    </section>
  );
}
