import { expect, it } from 'vitest';
import baseline from '../../../content/compatibility-v1.json';
import intro from '../../../content/lessons/vi/intro.json';
import { lessonSchema } from './index';
import { validateCompatibility } from './compatibility';
const lesson = lessonSchema.parse(intro[0]);
const fixture = { ...baseline, lessons: baseline.lessons.filter((l) => l.lessonId === lesson.id) };
it('accepts compatible wording and object key ordering without mutating input', () => {
  const before = structuredClone(fixture);
  expect(() => validateCompatibility([{ ...lesson, title: 'Tên rõ hơn' }], fixture)).not.toThrow();
  expect(fixture).toEqual(before);
});
it('blocks answer reordering, changed keys, mechanisms and version without migration', () => {
  const changed = structuredClone(lesson);
  changed.prediction.options.reverse();
  for (const next of [
    changed,
    { ...lesson, challenge: { ...lesson.challenge, answer: 1 - lesson.challenge.answer } },
    { ...lesson, kind: 'cache' as const },
    { ...lesson, moduleId: 'L5.1' },
  ])
    expect(() => validateCompatibility([next], fixture)).toThrow('Progress migration required');
});
it('blocks version changes in the published baseline', () => {
  const changed = structuredClone(fixture);
  changed.lessons[0]!.version = 2;
  expect(() => validateCompatibility([lesson], changed)).toThrow('Progress migration required');
});

it('blocks deleted or draft published IDs, duplicate records and unregistered beta', () => {
  expect(() => validateCompatibility([], fixture)).toThrow('Published lesson unavailable');
  expect(() => validateCompatibility([{ ...lesson, status: 'draft' }], fixture)).toThrow(
    'Published lesson unavailable',
  );
  expect(() =>
    validateCompatibility([lesson], {
      ...fixture,
      lessons: [...fixture.lessons, ...fixture.lessons],
    }),
  ).toThrow('Duplicate');
  expect(() => validateCompatibility([lesson, { ...lesson, id: 'new-lesson' }], fixture)).toThrow(
    'Missing compatibility',
  );
  expect(() => validateCompatibility([lesson], { ...fixture, progressVersion: 2 })).toThrow();
});
