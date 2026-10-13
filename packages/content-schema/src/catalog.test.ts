import { it, expect } from 'vitest';
import { lessonSchema, validateCatalog } from './index';
import intro from '../../../content/lessons/vi/intro.json';
import foundations from '../../../content/lessons/vi/foundations.json';
import registry from '../../../content/editorial.json';
const lessons = [...intro, ...foundations].map((l) => lessonSchema.parse(l));
const modules = Array.from({ length: 6 }, (_, level) =>
  Array.from({ length: 6 }, (_, i) => ({
    id: `L${level}.${i + 1}`,
    level: `L${level}`,
    title: 'Module',
    topics: 'Topics',
  })),
).flat();
it('validates actual catalog without equating beta coverage with module completion', () => {
  const result = validateCatalog(modules, lessons, registry);
  expect(result.lessons).toHaveLength(10);
  expect(result.coverage).toHaveLength(36);
  expect(result.coverage.every((c) => !c.complete)).toBe(true);
});
it('blocks duplicates, missing sources, cyclic and unavailable prerequisites', () => {
  expect(() => validateCatalog(modules, [...lessons, lessons[0]!], registry)).toThrow(
    'Duplicate lesson',
  );
  const badSource = structuredClone(registry);
  badSource.lessons[0]!.claims[0]!.sourceIds = ['missing'];
  expect(() => validateCatalog(modules, lessons, badSource)).toThrow('Unknown source');
  const cycle = structuredClone(registry);
  cycle.lessons.find((r) => r.lessonId === 'request')!.prerequisiteIds = ['cache'];
  expect(() => validateCatalog(modules, lessons, cycle)).toThrow('cycle');
  const missing = structuredClone(registry);
  missing.lessons[0]!.prerequisiteIds = ['missing'];
  expect(() => validateCatalog(modules, lessons, missing)).toThrow('Unavailable prerequisite');
});
it('blocks unreviewed beta, mismatched module and unsupported activity', () => {
  const pending = structuredClone(registry);
  pending.lessons[0]!.review.status = 'pending';
  expect(() => validateCatalog(modules, lessons, pending)).toThrow('Unreviewed beta');
  expect(() =>
    validateCatalog(
      modules,
      lessons.map((l) => (l.id === 'request' ? { ...l, level: 'L1' } : l)),
      registry,
    ),
  ).toThrow('Module/level');
  expect(() => lessonSchema.parse({ ...lessons[0], kind: 'execute-code' })).toThrow();
});
it('excludes draft lessons and disallows beta depending on draft', () => {
  const draft = lessons.map((l) => (l.id === 'design' ? { ...l, status: 'draft' as const } : l));
  expect(validateCatalog(modules, draft, registry).lessons).toHaveLength(9);
  const draftPrereq = lessons.map((l) =>
    l.id === 'request' ? { ...l, status: 'draft' as const } : l,
  );
  expect(() => validateCatalog(modules, draftPrereq, registry)).toThrow('Unavailable prerequisite');
});
