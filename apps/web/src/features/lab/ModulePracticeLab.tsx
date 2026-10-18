import type { Lesson, LessonProgress } from '@sdl/content-schema';
import { evaluatePractice, PRACTICE_MODEL_VERSION } from '@sdl/learning-core';
export function ModulePracticeLab({
  lesson,
  progress,
  onChange,
}: {
  lesson: Lesson;
  progress: LessonProgress;
  onChange(patch: Partial<LessonProgress>): void;
}) {
  const practice = lesson.practice!;
  const state = evaluatePractice(practice.items, progress.lab);
  const checked = progress.lab.checked === true;
  function choose(index: number, answer: number) {
    const answers = [...state.answers];
    answers[index] = answer;
    onChange({
      lab: {
        modelVersion: PRACTICE_MODEL_VERSION,
        practiceVersion: practice.version,
        answers: JSON.stringify(answers),
        checked: false,
      },
      completed: false,
      actions: progress.actions + 1,
    });
  }
  function check() {
    onChange({
      lab: {
        modelVersion: PRACTICE_MODEL_VERSION,
        practiceVersion: practice.version,
        answers: JSON.stringify(state.answers),
        checked: true,
      },
      actions: progress.actions + 1,
    });
  }
  function reset() {
    onChange({
      lab: {
        modelVersion: PRACTICE_MODEL_VERSION,
        practiceVersion: practice.version,
        answers: JSON.stringify(practice.items.map(() => -1)),
        checked: false,
      },
      completed: false,
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Bài tập tổng hợp module">
      <h2>Giải thích quyết định trong từng tình huống</h2>
      <p>
        Chọn cách giải thích, rồi kiểm tra cả bài. Đổi đáp án sẽ ẩn kết quả cũ và cần kiểm tra lại.
        Đây là tự luyện, không chứng nhận thành thạo toàn module.
      </p>
      {practice.items.map((q, i) => (
        <fieldset className="module-practice-item" key={q.id}>
          <legend>
            {i + 1}. {q.text}
          </legend>
          <div className="answer-options">
            {q.options.map((option, a) => (
              <button
                className="answer-option"
                key={a}
                aria-pressed={state.answers[i] === a}
                onClick={() => choose(i, a)}
              >
                {option}
              </button>
            ))}
          </div>
          {checked && (
            <p className={state.correct[i] ? 'practice-correct' : 'practice-retry'}>
              <strong>
                {state.correct[i]
                  ? 'Đúng.'
                  : state.answers[i] === -1
                    ? 'Chưa trả lời.'
                    : 'Cần xem lại.'}
              </strong>{' '}
              {q.explanation}
            </p>
          )}
        </fieldset>
      ))}
      <div className="lab-controls">
        <button className="button primary" onClick={check}>
          Kiểm tra bài áp dụng
        </button>
        <button className="button secondary" onClick={reset}>
          Làm lại bài áp dụng
        </button>
      </div>
      <p role="status">
        {checked
          ? `Đúng ${state.score}/${state.total}. ${state.passed ? 'Đã giải thích đúng các tình huống của bài.' : 'Xem lời giải rồi thử lại các lựa chọn cần xem lại.'}`
          : `Đã chọn ${state.answered}/${state.total}. Chưa kiểm tra lại.`}
      </p>
      <p className="muted">
        Điểm được tính lại từ lựa chọn đã lưu, không lấy từ điểm nhập. Kết quả này chỉ áp dụng cho
        các câu hỏi và phiên bản của bài, không thay pilot học sinh hoặc đánh giá chuyên gia.
      </p>
    </section>
  );
}
