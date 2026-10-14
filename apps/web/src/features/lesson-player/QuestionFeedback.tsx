import type { Lesson } from '@sdl/content-schema';
import { AnnotatedText } from './TermNote';
export function QuestionFeedback({
  lesson,
  question,
  correct,
  level,
  onReveal,
}: {
  lesson: Lesson;
  question: 'prediction' | 'challenge';
  correct: boolean;
  level: number;
  onReveal(level: number): void;
}) {
  const hints = lesson.guidance?.[question];
  const revealSolution = correct || !hints || level === 3;
  return (
    <div className={`feedback ${correct ? 'success' : 'warning'}`}>
      <div>
        <strong role="status">
          {correct ? 'Bạn đã nối đúng các ý.' : 'Cùng nhìn lại nguyên nhân.'}
        </strong>
        {revealSolution ? (
          <p>
            <AnnotatedText text={lesson[question].explanation} terms={lesson.terms} />
          </p>
        ) : (
          <p>Bạn có thể chọn lại. Nếu cần, mở từng gợi ý để tự tìm ra nguyên nhân.</p>
        )}
        {!correct && hints && (
          <div className="question-hints">
            {level >= 1 && (
              <section aria-label="Gợi ý 1">
                <h3>1. Nhìn vào đâu?</h3>
                <p>
                  <AnnotatedText text={hints[0]} terms={lesson.terms} />
                </p>
              </section>
            )}
            {level >= 2 && (
              <section aria-label="Gợi ý 2">
                <h3>2. Suy luận từng bước</h3>
                <p>
                  <AnnotatedText text={hints[1]} terms={lesson.terms} />
                </p>
              </section>
            )}
            {level < 3 && (
              <button className="button secondary" onClick={() => onReveal(level + 1)}>
                {level === 0 ? 'Mở gợi ý 1' : level === 1 ? 'Mở gợi ý 2' : 'Xem lời giải'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
