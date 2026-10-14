import type { Lesson } from '@sdl/content-schema';
import { AnnotatedText } from './TermNote';

export function CaseStudyContext({ lesson }: { lesson: Lesson }) {
  const c = lesson.caseStudy;
  if (!c) return null;
  return (
    <section className="case-context" aria-labelledby="case-title">
      <p className="case-provenance">
        {c.provenance.kind === 'authored-scenario'
          ? 'Tình huống giả định'
          : 'Tình huống chuyển thể từ nguồn'}
      </p>
      <h2 id="case-title">{c.title}</h2>
      <p>
        <AnnotatedText text={c.context} terms={lesson.terms} />
      </p>
      <div className="case-requirements">
        <h3>Cần đạt điều gì?</h3>
        <ul>
          {c.requirements.map((text) => (
            <li key={text}>
              <AnnotatedText text={text} terms={lesson.terms} />
            </li>
          ))}
        </ul>
      </div>
      <details className="case-limits">
        <summary>Giới hạn tình huống</summary>
        <p>
          <AnnotatedText text={c.limitations} terms={lesson.terms} />
        </p>
        {c.provenance.kind === 'documented-case' && <p>{c.provenance.adaptationNote}</p>}
      </details>
    </section>
  );
}

export function CaseStudyReflection({
  lesson,
  answered,
  onExperiment,
}: {
  lesson: Lesson;
  answered: boolean;
  onExperiment: () => void;
}) {
  const c = lesson.caseStudy;
  if (!c) return null;
  return (
    <div className="case-reflection">
      {answered && (
        <section aria-labelledby="case-tradeoffs">
          <h3 id="case-tradeoffs">Lợi ích và đánh đổi</h3>
          {c.tradeoffs.map((text) => (
            <p key={text}>
              <AnnotatedText text={text} terms={lesson.terms} />
            </p>
          ))}
        </section>
      )}
      <details className="case-experiment">
        <summary>Gợi ý thử trong thí nghiệm</summary>
        <ol>
          {c.experimentSteps.map((text) => (
            <li key={text}>
              <AnnotatedText text={text} terms={lesson.terms} />
            </li>
          ))}
        </ol>
      </details>
      <button className="button secondary" onClick={onExperiment}>
        Thử lại trong thí nghiệm
      </button>
      <p className="muted case-return-note">Giữ nguyên dữ liệu đang thử và câu trả lời của bạn.</p>
    </div>
  );
}
