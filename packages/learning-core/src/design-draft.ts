import type { Lesson, LessonProgress } from '@sdl/content-schema';
import { evaluatePractice } from './module-practice';

// This checks draft presence, never the correctness or mastery of a design.
export function readDesignDraft(
  task: NonNullable<Lesson['designTask']>,
  lab: Record<string, unknown>,
) {
  const answers = task.deliverables.map(({ id }) => {
    const value = lab[`design-${id}`];
    return typeof value === 'string' && value.length <= 2000 ? value : '';
  });
  const variation =
    typeof lab['design-variation'] === 'string' && lab['design-variation'].length <= 2000
      ? lab['design-variation']
      : '';
  return {
    answers,
    variation,
    ready: answers.every((a) => a.trim().length > 0) && variation.trim().length > 0,
  };
}

// Preserve legacy completion semantics; new design lessons require their evidence.
export function isLessonComplete(lesson: Lesson, progress?: LessonProgress): boolean {
  if (!progress?.completed) return false;
  if (!lesson.designTask) return true;
  return (
    progress.stage === 3 &&
    progress.challenge === lesson.challenge.answer &&
    Boolean(lesson.practice && evaluatePractice(lesson.practice.items, progress.lab).ready) &&
    readDesignDraft(lesson.designTask, progress.lab).ready
  );
}
