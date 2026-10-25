import { QuestionFeedback } from './QuestionFeedback';
import { LessonChapters } from './LessonChapters';
import { DesignDraft } from './DesignDraft';
import { CaseStudyContext, CaseStudyReflection } from './CaseStudyPanel';
import { AnnotatedText, TermNote } from './TermNote';
import { SaveStatus } from '../progress/SaveStatus';
import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router';
import { lessons, editorial } from '../../app/catalog';
import { useProgress } from '../../app/progress';
import {
  newLessonProgress,
  evaluatePractice,
  readDesignDraft,
  isLessonComplete,
} from '@sdl/learning-core';
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
  const record = editorial.lessons.find((r) => r.lessonId === lesson.id);
  const prerequisites = lessons.filter((l) => record?.prerequisiteIds.includes(l.id));
  const current = p.stage === 1 ? lesson.prediction : lesson.challenge;
  const answer = p.stage === 1 ? p.prediction : p.challenge;
  const answered = answer >= 0;
  const correct = answer === current.answer;
  const questionKey = p.stage === 1 ? 'prediction' : 'challenge';
  const hintLevel = p.hints?.[questionKey] ?? 0;
  const revealSolution = correct || !lesson.guidance || hintLevel === 3;
  const saveFailed =
    saveState === 'write-error' || saveState === 'read-error' || saveState === 'conflict';
  const labReady = lesson.practice
    ? evaluatePractice(lesson.practice.items, p.lab).ready
    : p.actions >= 2;
  const draftReady = !lesson.designTask || readDesignDraft(lesson.designTask, p.lab).ready;
  const completed = isLessonComplete(lesson, p);
  const canNext = p.stage === 0 || (p.stage === 1 && answered) || (p.stage === 2 && labReady);
  const stageHelp =
    p.stage === 0
      ? 'Đọc tình huống rồi chọn điều bạn nghĩ sẽ xảy ra.'
      : p.stage === 1
        ? answered
          ? revealSolution
            ? 'Đọc lời giải rồi mở thí nghiệm để kiểm tra dự đoán.'
            : 'Thử suy luận, mở gợi ý nếu cần hoặc vào thí nghiệm để kiểm tra dự đoán.'
          : 'Chọn một dự đoán. Đoán sai cũng là một cách học.'
        : p.stage === 2
          ? lesson.practice && !labReady
            ? 'Chọn lời giải cho mọi tình huống và kiểm tra đúng toàn bài để mở chặng áp dụng.'
            : p.actions < 2
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
        <p>
          <AnnotatedText text={lesson.objective} terms={lesson.terms} />
        </p>
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
          <p>
            <AnnotatedText text={lesson.story} terms={lesson.terms} />
          </p>
          {prerequisites.length > 0 && (
            <p className="prerequisites">
              Nên biết trước:{' '}
              {prerequisites.map((l, i) => (
                <span key={l.id}>
                  {i > 0 ? '; ' : ''}
                  <Link to={`/learn/${l.id}`}>{l.title}</Link>
                </span>
              ))}
            </p>
          )}
          <div className="story-reminder">
            <Icon name="book" />
            <p>Không cần viết code. Hãy đọc câu chuyện, dự đoán rồi tự thử từng bước.</p>
          </div>
        </section>
      )}
      {p.stage === 3 && <CaseStudyContext lesson={lesson} />}
      {(p.stage === 0 || p.stage === 2) && <LessonChapters lesson={lesson} />}
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
            <QuestionFeedback
              lesson={lesson}
              question={questionKey}
              correct={correct}
              level={hintLevel}
              onReveal={(level) =>
                update(lesson.id, {
                  hints: {
                    prediction: p.hints?.prediction ?? 0,
                    challenge: p.hints?.challenge ?? 0,
                    [questionKey]: level,
                  },
                })
              }
            />
          )}
          {p.stage === 3 && (
            <CaseStudyReflection
              lesson={lesson}
              answered={answered && revealSolution}
              onExperiment={() => {
                update(lesson.id, { stage: 2 });
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            />
          )}
          {p.stage === 3 && answered && correct && (
            <DesignDraft
              lesson={lesson}
              progress={p}
              onChange={(patch) => update(lesson.id, patch)}
            />
          )}
          {p.stage === 3 && answered && correct && (
            <button
              className="button primary"
              disabled={!draftReady || !labReady}
              onClick={() => update(lesson.id, { completed: true })}
            >
              {completed
                ? lesson.designTask
                  ? 'Đã lưu bài tự luyện và bản thiết kế'
                  : 'Đã hoàn thành bài nhập môn'
                : 'Lưu bài đã hoàn thành'}
              <Icon name="check" />
            </button>
          )}
          {p.stage === 3 && completed && (
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
            <p>
              <AnnotatedText text={lesson.explanation} terms={lesson.terms} />
            </p>
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
              <TermNote term={t}>{t.name}</TermNote> <span>({t.english})</span>
            </strong>
            {!('showPopover' in HTMLElement.prototype) && <p>{t.meaning}</p>}
          </div>
        ))}
      </details>
      <details className="model-notes">
        <summary>Giả định mô hình và nguồn đọc thêm</summary>
        <p>
          <AnnotatedText text={lesson.limit} terms={lesson.terms} />
        </p>
        <p className="muted">
          Bài beta được đối chiếu nguồn bởi trợ lý AI. Chưa qua review chuyên gia độc lập hoặc pilot
          học sinh.
        </p>
        {lesson.sources.map((s) => (
          <a href={s.url} key={s.url} target="_blank" rel="noreferrer">
            {s.title} ↗
          </a>
        ))}
        {lesson.sources.some((s) => s.url.includes('donnemartin')) && (
          <p className="muted">
            Tham khảo System Design Primer — Donne Martin và contributors, CC BY 4.0. Bài này diễn
            giải và dùng ví dụ riêng.{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
              Giấy phép CC BY 4.0 ↗
            </a>
          </p>
        )}
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
