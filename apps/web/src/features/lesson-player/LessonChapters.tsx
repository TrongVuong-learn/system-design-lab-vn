import type { Lesson } from '@sdl/content-schema';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { AnnotatedText } from './TermNote';
export function LessonChapters({ lesson }: { lesson: Lesson }) {
  if (!lesson.chapters) return null;
  return (
    <section className="lesson-chapters" aria-label="Giải thích từng cơ chế">
      <VStack gap={4}>
        <VStack gap={1}>
          <Heading level={2}>Học từng phần trước khi thử</Heading>
          <Text as="p" color="secondary">
            Mở một phần để đọc cách hoạt động, theo ví dụ rồi kiểm tra điều dễ nhầm.
          </Text>
        </VStack>
        <Card padding={0}>
          {lesson.chapters.items.map((chapter, index) => (
            <details key={chapter.id} className="lesson-chapter disclosure" open={index === 0}>
              <summary>{chapter.title}</summary>
              <VStack gap={3} className="disclosure-body">
                <Text as="p">
                  <AnnotatedText text={chapter.explanation} terms={lesson.terms} />
                </Text>
                <Heading level={3}>Thử theo ví dụ</Heading>
                <Text as="p">
                  <AnnotatedText text={chapter.example} terms={lesson.terms} />
                </Text>
                <ol className="steps-list">
                  {chapter.steps.map((step, i) => (
                    <li key={i}>
                      <AnnotatedText text={step} terms={lesson.terms} />
                    </li>
                  ))}
                </ol>
                <Card variant="yellow" padding={3} className="chapter-misconception">
                  <Text as="p">
                    <strong>Điều dễ nhầm: </strong>
                    <AnnotatedText text={chapter.misconception} terms={lesson.terms} />
                  </Text>
                </Card>
              </VStack>
            </details>
          ))}
        </Card>
      </VStack>
    </section>
  );
}
