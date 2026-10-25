import type { Lesson } from '@sdl/content-schema';
import { AnnotatedText } from './TermNote';
export function LessonChapters({ lesson }: { lesson: Lesson }) {
  if (!lesson.chapters) return null;
  return (
    <section className="lesson-chapters" aria-label="Giải thích từng cơ chế">
      <h2>Học từng phần trước khi thử</h2>
      <p>Mở một phần để đọc cách hoạt động, theo ví dụ rồi kiểm tra điều dễ nhầm.</p>
      {lesson.chapters.items.map((chapter, index) => (
        <details key={chapter.id} className="lesson-chapter" open={index === 0}>
          <summary>{chapter.title}</summary>
          <p>
            <AnnotatedText text={chapter.explanation} terms={lesson.terms} />
          </p>
          <h3>Thử theo ví dụ</h3>
          <p>
            <AnnotatedText text={chapter.example} terms={lesson.terms} />
          </p>
          <ol>
            {chapter.steps.map((step, i) => (
              <li key={i}>
                <AnnotatedText text={step} terms={lesson.terms} />
              </li>
            ))}
          </ol>
          <p className="chapter-misconception">
            <strong>Điều dễ nhầm: </strong>
            <AnnotatedText text={chapter.misconception} terms={lesson.terms} />
          </p>
        </details>
      ))}
    </section>
  );
}
