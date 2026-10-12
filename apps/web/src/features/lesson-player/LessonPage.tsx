import { SaveStatus } from '../progress/SaveStatus';
import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router';
import { lessons } from '../../app/catalog';
import { useProgress } from '../../app/progress';
import { newLessonProgress } from '@sdl/learning-core';
import { Lab } from '../lab/Lab';
import { Icon } from '../../ui/primitives';
import { NotFound } from '../catalog/Pages';
const stages = ['Hiểu câu chuyện', 'Dự đoán', 'Tự thử', 'Áp dụng'];
export function LessonPage() {
  const { id } = useParams();
  const lesson = lessons.find((l) => l.id === id);
  const { progress, update, ready, saveState } = useProgress();
  const heading = useRef<HTMLHeadingElement>(null);
  const stageHeading = useRef<HTMLHeadingElement>(null);
  const p = progress.lessons[id ?? ''] ?? newLessonProgress();
  useEffect(() => {
    if (ready) (stageHeading.current ?? heading.current)?.focus({ preventScroll: true });
  }, [id, p.stage, ready]);
  if (!lesson) return <NotFound />;
  if (!ready)
    return (
      <div className="page-content" role="status">
        Đang mở bài học…
      </div>
    );
  const current = p.stage === 1 ? lesson.prediction : lesson.challenge;
  const answer = p.stage === 1 ? p.prediction : p.challenge;
  const answered = answer >= 0;
  const correct = answer === current.answer;
  const saveFailed = saveState === 'write-error' || saveState === 'read-error';
  const canNext = p.stage === 0 || (p.stage === 1 && answered) || (p.stage === 2 && p.actions >= 2);
  const stageHelp =
    p.stage === 0
      ? 'Đọc tình huống rồi chọn điều bạn nghĩ sẽ xảy ra.'
      : p.stage === 1
        ? answered
          ? 'Đọc lời giải rồi mở thí nghiệm để kiểm tra dự đoán.'
          : 'Chọn một dự đoán. Đoán sai cũng là một cách học.'
        : p.stage === 2
          ? p.actions < 2
            ? `Thử thêm ${2 - p.actions} thao tác để mở chặng áp dụng.`
            : 'Bạn có thể thử tiếp hoặc áp dụng điều vừa thấy vào tình huống mới.'
          : 'Dùng điều vừa học để trả lời một tình huống khác.';
  function next() {
    if (p.stage < 3) {
      update(lesson!.id, { stage: p.stage + 1 });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  return (
    <article className="lesson-page">
      <div className="lesson-topbar">
        <Link to="/explore" className="back-link">
          ← Về lộ trình
        </Link>
        <span>{lesson.minutes} phút · Bản thử nghiệm</span>
      </div>
      <div className="lesson-heading">
        <span className="eyebrow">
          {lesson.level} · Chặng {p.stage + 1}/4
        </span>
        <h1 ref={heading} tabIndex={-1}>
          {lesson.title}
        </h1>
        <p>{lesson.objective}</p>
      </div>
      <ol className="stage-list" aria-label="Các chặng học">
        {stages.map((s, i) => (
          <li
            key={s}
            aria-current={p.stage === i ? 'step' : undefined}
            className={p.stage === i ? 'current' : p.stage > i ? 'past' : ''}
          >
            <span>{i + 1}</span>
            <b>{s}</b>
          </li>
        ))}
      </ol>
      <section className="stage-brief" aria-labelledby="stage-heading">
        <h2 id="stage-heading" ref={stageHeading} tabIndex={-1}>
          {stages[p.stage]}
        </h2>
        <p id="stage-help">{stageHelp}</p>
      </section>
      {saveFailed && <SaveStatus />}
      {p.stage === 0 && (
        <section className="story-panel">
          <span className="eyebrow">Tình huống</span>
          <h2>{lesson.subtitle}</h2>
          <p>{lesson.story}</p>
          <div className="story-reminder">
            <Icon name="book" />
            <p>Không cần viết code. Hãy đọc câu chuyện, dự đoán rồi tự thử từng bước.</p>
          </div>
        </section>
      )}
      {(p.stage === 1 || p.stage === 3) && (
        <section className="question-panel">
          <span className="eyebrow">{p.stage === 1 ? 'Dự đoán của bạn' : 'Tình huống mới'}</span>
          <h2>{current.text}</h2>
          <div className="answer-options">
            {current.options.map((option, i) => (
              <button
                key={option}
                aria-pressed={answer === i}
                className={`answer-option ${answer === i ? 'selected' : ''}`}
                onClick={() =>
                  update(
                    lesson.id,
                    p.stage === 1 ? { prediction: i } : { challenge: i, completed: false },
                  )
                }
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {option}
                {answer === i && <Icon name="check" size={18} />}
              </button>
            ))}
          </div>
          {answered && (
            <div className={`feedback ${correct ? 'success' : ''}`} role="status">
              <div>
                <strong>{correct ? 'Bạn đã nối đúng các ý.' : 'Cùng nhìn lại nguyên nhân.'}</strong>
                <p>{current.explanation}</p>
                {!correct && <p className="muted">Bạn có thể chọn lại sau khi đọc lời giải.</p>}
              </div>
            </div>
          )}
          {p.stage === 3 && answered && correct && (
            <button
              className="button primary"
              onClick={() => update(lesson.id, { completed: true })}
            >
              {p.completed ? 'Đã hoàn thành bài nhập môn' : 'Lưu bài đã hoàn thành'}
              <Icon name="check" />
            </button>
          )}
          {p.stage === 3 && p.completed && (
            <div className="completion">
              <h3>Một bước hiểu mới của bạn.</h3>
              <p>
                Thử nghiệm và lời giải vẫn ở đây để bạn quay lại. Tiếp tục một bài khác để nối các ý
                với nhau.
              </p>
              <Link to="/explore" className="text-link">
                Chọn thí nghiệm tiếp theo <Icon name="arrow" />
              </Link>
            </div>
          )}
        </section>
      )}
      {p.stage === 2 && (
        <>
          <Lab lesson={lesson} progress={p} onChange={(patch) => update(lesson.id, patch)} />
          <section className="explanation-panel">
            <h2>Điều vừa thấy có nghĩa gì?</h2>
            <p>{lesson.explanation}</p>
            <p className="muted">
              Hãy thay một yếu tố mỗi lần và giải thích điều bạn thấy. Các số liệu bên trên thuộc mô
              hình của bài học.
            </p>
          </section>
        </>
      )}
      <details className="glossary">
        <summary>
          <Icon name="book" size={18} />
          Giải thích từ mới
        </summary>
        {lesson.terms.map((t) => (
          <div key={t.english}>
            <strong>
              {t.name} <span>({t.english})</span>
            </strong>
            <p>{t.meaning}</p>
          </div>
        ))}
      </details>
      <details className="model-notes">
        <summary>Giả định mô hình và nguồn đọc thêm</summary>
        <p>{lesson.limit}</p>
        {lesson.sources.map((s) => (
          <a href={s.url} key={s.url} target="_blank" rel="noreferrer">
            {s.title} ↗
          </a>
        ))}
      </details>
      <div className="lesson-footer">
        {!saveFailed && <SaveStatus />}
        <div className="lesson-footer-actions">
          {p.stage > 0 && (
            <button
              className="button secondary"
              onClick={() => {
                update(lesson.id, { stage: p.stage - 1 });
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            >
              Chặng trước
            </button>
          )}
          {p.stage < 3 && (
            <button
              className="button primary"
              disabled={!canNext}
              aria-describedby="stage-help"
              onClick={next}
            >
              {p.stage === 0
                ? 'Đưa ra dự đoán'
                : p.stage === 1
                  ? 'Mở thí nghiệm'
                  : 'Thử tình huống mới'}
              <Icon name="arrow" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
