import { it, expect } from 'vitest';
import { lessonSchema, validateCatalog } from './index';
import intro from '../../../content/lessons/vi/intro.json';
import foundations from '../../../content/lessons/vi/foundations.json';
import webNetwork from '../../../content/lessons/vi/web-network.json';
import routing from '../../../content/lessons/vi/routing.json';
import registry from '../../../content/editorial.json';
const lessons = [...intro, ...foundations, ...webNetwork, ...routing].map((l) =>
  lessonSchema.parse(l),
);
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
  expect(result.lessons).toHaveLength(13);
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
  expect(validateCatalog(modules, draft, registry).lessons).toHaveLength(12);
  const draftPrereq = lessons.map((l) =>
    l.id === 'request' ? { ...l, status: 'draft' as const } : l,
  );
  expect(() => validateCatalog(modules, draftPrereq, registry)).toThrow('Unavailable prerequisite');
});

it('preserves all v1 assessment semantics when adding case context', async () => {
  const { default: legacy } = await import('./fixtures/legacy-assessments-v1.json');
  for (const l of lessons.filter((l) => l.id in legacy)) {
    expect({
      moduleId: l.moduleId,
      version: l.version,
      prediction: l.prediction,
      challenge: l.challenge,
    }).toEqual(legacy[l.id as keyof typeof legacy]);
  }
});
it('blocks absent, duplicate, mismatched, or stale beta cases', () => {
  const copy = () => structuredClone(lessons);
  const missing = copy();
  delete missing[0]!.caseStudy;
  expect(() => validateCatalog(modules, missing, registry)).toThrow('Missing beta case');
  const duplicated = copy();
  duplicated[1]!.caseStudy!.id = duplicated[0]!.caseStudy!.id;
  expect(() => validateCatalog(modules, duplicated, registry)).toThrow('Duplicate case');
  const activity = copy();
  activity[0]!.caseStudy!.activityRef = 'queue';
  expect(() => validateCatalog(modules, activity, registry)).toThrow('Case activity/module');
  const family = copy();
  family[0]!.caseStudy!.familyId = 'CASE-L5-06';
  expect(() => validateCatalog(modules, family, registry)).toThrow('Case activity/module');
  const stale = copy();
  stale[0]!.caseStudy!.revision++;
  expect(() => validateCatalog(modules, stale, registry)).toThrow('stale case review');
  const pending = structuredClone(registry);
  pending.lessons[0]!.caseReview.status = 'pending';
  expect(() => validateCatalog(modules, lessons, pending)).toThrow('stale case review');
});
it('rejects unverified documented provenance and executable case fields', () => {
  const documented = structuredClone(lessons);
  documented[0]!.caseStudy!.provenance = {
    kind: 'documented-case',
    sourceIds: ['missing'],
    adaptationNote: 'Ví dụ chuyển thể có giới hạn.',
  };
  expect(() => validateCatalog(modules, documented, registry)).toThrow('Invalid case source');
  expect(() =>
    lessonSchema.parse({
      ...lessons[0],
      caseStudy: { ...lessons[0]!.caseStudy, code: 'alert(1)' },
    }),
  ).toThrow();
  expect(() =>
    lessonSchema.parse({
      ...lessons[0],
      caseStudy: {
        ...lessons[0]!.caseStudy,
        provenance: { kind: 'documented-case', sourceIds: [] },
      },
    }),
  ).toThrow();
});
