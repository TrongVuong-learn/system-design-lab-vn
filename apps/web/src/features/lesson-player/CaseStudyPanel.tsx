import type { Lesson } from '@sdl/content-schema';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { VStack } from '@astryxdesign/core/VStack';
import { AnnotatedText } from './TermNote';

export function CaseStudyContext({ lesson }: { lesson: Lesson }) {
  const c = lesson.caseStudy;
  if (!c) return null;
  return (
    <section className="case-context" aria-labelledby="case-title">
      <Card padding={6}>
        <VStack gap={3}>
          <HStack>
            <Token
              size="sm"
              color="purple"
              label={
                c.provenance.kind === 'authored-scenario'
                  ? 'Tình huống giả định'
                  : 'Tình huống chuyển thể từ nguồn'
              }
              className="case-provenance"
            />
          </HStack>
          <h2 id="case-title" className="heading-2">
            {c.title}
          </h2>
          <Text as="p" type="large" weight="normal">
            <AnnotatedText text={c.context} terms={lesson.terms} />
          </Text>
          <Card variant="muted" padding={4} className="case-requirements">
            <VStack gap={2}>
              <Heading level={3}>Cần đạt điều gì?</Heading>
              <ul className="check-list">
                {c.requirements.map((text) => (
                  <li key={text}>
                    <AnnotatedText text={text} terms={lesson.terms} />
                  </li>
                ))}
              </ul>
            </VStack>
          </Card>
          <details className="case-limits disclosure inline-disclosure">
            <summary>Giới hạn tình huống</summary>
            <VStack gap={2} className="disclosure-body">
              <Text as="p">
                <AnnotatedText text={c.limitations} terms={lesson.terms} />
              </Text>
              {c.provenance.kind === 'documented-case' && (
                <Text as="p">{c.provenance.adaptationNote}</Text>
              )}
            </VStack>
          </details>
        </VStack>
      </Card>
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
    <VStack gap={3} className="case-reflection">
      {answered && (
        <section aria-labelledby="case-tradeoffs">
          <VStack gap={2}>
            <h3 id="case-tradeoffs" className="heading-3">
              Lợi ích và đánh đổi
            </h3>
            {c.tradeoffs.map((text) => (
              <Text as="p" key={text}>
                <AnnotatedText text={text} terms={lesson.terms} />
              </Text>
            ))}
          </VStack>
        </section>
      )}
      <details className="case-experiment disclosure inline-disclosure">
        <summary>Gợi ý thử trong thí nghiệm</summary>
        <ol className="steps-list disclosure-body">
          {c.experimentSteps.map((text) => (
            <li key={text}>
              <AnnotatedText text={text} terms={lesson.terms} />
            </li>
          ))}
        </ol>
      </details>
      <HStack gap={3} vAlign="center" wrap="wrap">
        <Button label="Thử lại trong thí nghiệm" onClick={onExperiment} />
        <Text type="supporting" className="case-return-note">
          Giữ nguyên dữ liệu đang thử và câu trả lời của bạn.
        </Text>
      </HStack>
    </VStack>
  );
}
