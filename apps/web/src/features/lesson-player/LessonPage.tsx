import { LessonGameBridge } from '../../ui/motion/LessonGameBridge';
import { QuestionFeedback } from './QuestionFeedback';
import { LessonChapters } from './LessonChapters';
import { DesignDraft } from './DesignDraft';
import { CaseStudyContext, CaseStudyReflection } from './CaseStudyPanel';
import { AnnotatedText, TermNote } from './TermNote';
import { SaveStatus } from '../progress/SaveStatus';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '../../ui/Button';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Link } from '@astryxdesign/core/Link';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
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
      <Text as="p" role="status">
        Đang mở bài học…
      </Text>
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
  function goTo(stage: number) {
    update(lesson!.id, { stage });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  return (
    <article className="lesson-page" data-level={lesson.level}>
      <VStack gap={6}>
        <HStack gap={2} hAlign="between" vAlign="center" wrap="wrap" className="lesson-topbar">
          <Link href="/explore">Về lộ trình</Link>
          <Text type="supporting">{lesson.minutes} phút, bản thử nghiệm</Text>
        </HStack>

        <VStack gap={2} className="lesson-heading">
          <p className="lesson-meta">
            <span className="level-chip">{lesson.level}</span>
            <span>Chặng {p.stage + 1}/4</span>
          </p>
          <h1 ref={heading} tabIndex={-1} className="heading-1">
            {lesson.title}
          </h1>
          <Text as="p" type="large" weight="normal" color="secondary">
            <AnnotatedText text={lesson.objective} terms={lesson.terms} />
          </Text>
        </VStack>

        <ol className="stage-list" aria-label="Các chặng học">
          {stages.map((s, i) => (
            <li
              key={s}
              aria-current={p.stage === i ? 'step' : undefined}
              className={p.stage === i ? 'current' : p.stage > i ? 'past' : ''}
            >
              <span className="stage-index">{p.stage > i ? '✓' : i + 1}</span>
              <span className="stage-name">{s}</span>
            </li>
          ))}
        </ol>

        <section className="stage-brief" aria-labelledby="stage-heading">
          <h2 id="stage-heading" ref={stageHeading} tabIndex={-1} className="heading-2">
            {stages[p.stage]}
          </h2>
          <Text as="p" color="secondary" id="stage-help">
            {stageHelp}
          </Text>
        </section>

        {saveFailed && <SaveStatus />}

        {p.stage === 0 && (
          <Card padding={6} className="story-panel">
            <VStack gap={3}>
              <Text type="supporting" weight="semibold">
                Tình huống
              </Text>
              <Heading level={2}>{lesson.subtitle}</Heading>
              <Text as="p">
                <AnnotatedText text={lesson.story} terms={lesson.terms} />
              </Text>
              {prerequisites.length > 0 && (
                <Text as="p" className="prerequisites">
                  Nên biết trước:{' '}
                  {prerequisites.map((l, i) => (
                    <span key={l.id}>
                      {i > 0 ? '; ' : ''}
                      <Link href={`/learn/${l.id}`}>{l.title}</Link>
                    </span>
                  ))}
                </Text>
              )}
              <p className="quiet-note">
                <strong>Không cần viết code.</strong> Hãy đọc câu chuyện, dự đoán rồi tự thử từng
                bước.
              </p>
            </VStack>
          </Card>
        )}
        {p.stage === 0 && <LessonGameBridge lessonId={lesson.id} />}
        {p.stage === 3 && <CaseStudyContext lesson={lesson} />}
        {(p.stage === 0 || p.stage === 2) && <LessonChapters lesson={lesson} />}

        {(p.stage === 1 || p.stage === 3) && (
          <Card padding={6} className="question-panel">
            <VStack gap={4}>
              <Text type="supporting" weight="semibold">
                {p.stage === 1 ? 'Dự đoán của bạn' : 'Tình huống mới'}
              </Text>
              <Heading level={2}>{current.text}</Heading>
              <div className="answer-options">
                {current.options.map((option, i) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={answer === i}
                    className={`answer-option ${answer === i ? 'selected' : ''}`}
                    onClick={() =>
                      update(
                        lesson.id,
                        p.stage === 1 ? { prediction: i } : { challenge: i, completed: false },
                      )
                    }
                  >
                    <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
                    <span className="answer-text">{option}</span>
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
                  onExperiment={() => goTo(2)}
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
                <HStack>
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<Icon name="check" />}
                    isDisabled={!draftReady || !labReady}
                    label={
                      completed
                        ? lesson.designTask
                          ? 'Đã lưu bài tự luyện và bản thiết kế'
                          : 'Đã hoàn thành bài nhập môn'
                        : 'Lưu bài đã hoàn thành'
                    }
                    onClick={() => update(lesson.id, { completed: true })}
                  />
                </HStack>
              )}
              {p.stage === 3 && completed && (
                <Banner
                  status="success"
                  title={<h3 className="heading-inherit">Một bước hiểu mới của bạn.</h3>}
                  description="Thử nghiệm và lời giải vẫn ở đây để bạn quay lại. Tiếp tục một bài khác để nối các ý với nhau."
                  endContent={<Button label="Chọn thí nghiệm tiếp theo" href="/explore" />}
                />
              )}
            </VStack>
          </Card>
        )}

        {p.stage === 2 && (
          <>
            <Lab lesson={lesson} progress={p} onChange={(patch) => update(lesson.id, patch)} />
            <Card variant="muted" padding={6} className="explanation-panel">
              <VStack gap={2}>
                <Heading level={2}>Điều vừa thấy có nghĩa gì?</Heading>
                <Text as="p">
                  <AnnotatedText text={lesson.explanation} terms={lesson.terms} />
                </Text>
                <Text as="p" type="supporting">
                  Hãy thay một yếu tố mỗi lần và giải thích điều bạn thấy. Các số liệu bên trên
                  thuộc mô hình của bài học.
                </Text>
              </VStack>
            </Card>
          </>
        )}

        <Card padding={0}>
          <details className="glossary disclosure">
            <summary>
              <Icon name="book" size={18} />
              Giải thích từ mới
            </summary>
            <VStack gap={2} className="disclosure-body">
              {lesson.terms.map((t) => (
                <div key={t.english}>
                  <strong>
                    <TermNote term={t}>{t.name}</TermNote> <span>({t.english})</span>
                  </strong>
                  {!('showPopover' in HTMLElement.prototype) && <p>{t.meaning}</p>}
                </div>
              ))}
            </VStack>
          </details>
          <details className="model-notes disclosure">
            <summary>Giả định mô hình và nguồn đọc thêm</summary>
            <VStack gap={2} className="disclosure-body">
              <Text as="p">
                <AnnotatedText text={lesson.limit} terms={lesson.terms} />
              </Text>
              <Text as="p" type="supporting">
                Bài beta được đối chiếu nguồn bởi trợ lý AI. Chưa qua review chuyên gia độc lập hoặc
                pilot học sinh.
              </Text>
              {lesson.sources.map((s) => (
                <Link href={s.url} key={s.url} isExternalLink newTabLabel="(mở tab mới)">
                  {s.title}
                </Link>
              ))}
              {lesson.sources.some((s) => s.url.includes('donnemartin')) && (
                <Text as="p" type="supporting">
                  Tham khảo System Design Primer — Donne Martin và contributors, CC BY 4.0. Bài này
                  diễn giải và dùng ví dụ riêng.{' '}
                  <Link
                    href="https://creativecommons.org/licenses/by/4.0/"
                    isExternalLink
                    newTabLabel="(mở tab mới)"
                  >
                    Giấy phép CC BY 4.0
                  </Link>
                </Text>
              )}
            </VStack>
          </details>
        </Card>

        <HStack gap={3} hAlign="between" vAlign="center" wrap="wrap" className="lesson-footer">
          {!saveFailed ? <SaveStatus /> : <span />}
          <HStack gap={2} className="lesson-footer-actions">
            {p.stage > 0 && <Button label="Chặng trước" onClick={() => goTo(p.stage - 1)} />}
            {p.stage < 3 && (
              <Button
                variant="primary"
                isDisabled={!canNext}
                aria-describedby="stage-help"
                label={
                  p.stage === 0
                    ? 'Đưa ra dự đoán'
                    : p.stage === 1
                      ? 'Mở thí nghiệm'
                      : 'Thử tình huống mới'
                }
                endContent={<Icon name="arrow" />}
                onClick={() => {
                  if (p.stage < 3) goTo(p.stage + 1);
                }}
              />
            )}
          </HStack>
        </HStack>
      </VStack>
    </article>
  );
}
