import { expect, it } from 'vitest';
import { readDesignDraft, isLessonComplete } from './design-draft';
import { lessonSchema } from '@sdl/content-schema';
import capstones from '../../../content/lessons/vi/level-capstones.json';
import {
  emptyProgress,
  updateLesson,
  parseProgress,
  serializeProgress,
  newLessonProgress,
} from './index';
const task = {
  version: 1 as const,
  prompt: 'Thiết kế một luồng đăng ký.',
  deliverables: [
    { id: 'scope', prompt: 'Yêu cầu và invariant.' },
    { id: 'flow', prompt: 'Luồng và lịch lỗi.' },
  ],
  rubric: ['Có nguồn giữ số chỗ.', 'Có cách kiểm sau lỗi.'],
  variation: 'Đổi yêu cầu thành hai vùng.',
};
it('requires each actual draft field, ignores imported readiness flags and does not grade text', () => {
  expect(readDesignDraft(task, { ready: true, score: 100 }).ready).toBe(false);
  const lab = { 'design-scope': 'Một chỗ.', 'design-flow': ' ', 'design-variation': 'Hai vùng.' };
  expect(readDesignDraft(task, lab).ready).toBe(false);
  expect(readDesignDraft(task, { ...lab, 'design-flow': 42 }).answers[1]).toBe('');
  expect(readDesignDraft(task, { ...lab, 'design-flow': 'x'.repeat(2001) }).ready).toBe(false);
  expect(readDesignDraft(task, { ...lab, 'design-flow': 'Nội dung chưa được chấm.' }).ready).toBe(
    true,
  );
});
it('roundtrips Vietnamese drafts with practice and legacy progress without changing the save format', () => {
  const original = updateLesson(emptyProgress(), 'cache', {
    stage: 2,
    lab: { minute: 5 },
    actions: 2,
  });
  const lab = {
    modelVersion: 1,
    practiceVersion: 1,
    checked: true,
    answers: '[0,1,0]',
    'design-scope': 'Giữ đúng một chỗ.',
    'design-flow': 'A → nguồn → ACK\nThử mất response.',
    'design-variation': 'Phía không có quyền chờ.',
  };
  const next = updateLesson(original, 'new-design', { stage: 3, lab });
  const restored = parseProgress(serializeProgress(next));
  expect(restored.version).toBe(1);
  expect(restored.lessons.cache).toEqual(original.lessons.cache);
  expect(restored.lessons['new-design']!.lab).toEqual(lab);
  expect(readDesignDraft(task, restored.lessons['new-design']!.lab).ready).toBe(true);
});

it('does not display imported design completion without the checked practice, transfer and actual draft', () => {
  const lesson = lessonSchema.parse(capstones[0]);
  const draft = Object.fromEntries(
    lesson.designTask!.deliverables.map((part) => [
      'design-' + part.id,
      'Lập luận chưa được chấm.',
    ]),
  );
  const progress = newLessonProgress();
  progress.stage = 3;
  progress.completed = true;
  progress.challenge = lesson.challenge.answer;
  progress.lab = {
    modelVersion: 1,
    practiceVersion: 1,
    checked: true,
    answers: JSON.stringify(lesson.practice!.items.map((item) => item.answer)),
    ...draft,
    'design-variation': 'Phương án khi đổi ràng buộc.',
  };
  expect(isLessonComplete(lesson, progress)).toBe(true);
  expect(
    isLessonComplete(lesson, { ...progress, lab: { ...progress.lab, 'design-variation': ' ' } }),
  ).toBe(false);
  expect(isLessonComplete(lesson, { ...progress, lab: { ...progress.lab, checked: false } })).toBe(
    false,
  );
  expect(isLessonComplete(lesson, { ...progress, challenge: -1 })).toBe(false);
  expect(
    isLessonComplete(
      { ...lesson, designTask: undefined },
      { ...newLessonProgress(), completed: true },
    ),
  ).toBe(true);
});
