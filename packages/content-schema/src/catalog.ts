import { z } from 'zod';
import type { Lesson, CurriculumModule } from './index';

const id = z.string().min(1);
export const editorialSchema = z.object({
  version: z.literal(1),
  sources: z.array(
    z.object({
      id,
      title: id,
      url: z.url(),
      revision: id,
      checkedAt: z.iso.date(),
      attribution: id,
    }),
  ),
  competencies: z.array(
    z.object({
      id,
      moduleId: id,
      outcome: id,
      depth: z.enum(['introductory', 'mechanism', 'design']),
      planRefs: z.array(id),
    }),
  ),
  lessons: z.array(
    z.object({
      lessonId: id,
      revision: z.number().int().positive(),
      competencyIds: z.array(id).min(1),
      prerequisiteIds: z.array(id),
      claims: z.array(z.object({ text: id, sourceIds: z.array(id).min(1) })).min(1),
      review: z.object({
        reviewer: id,
        reviewerType: z.enum(['agent', 'human']),
        date: z.iso.date(),
        status: z.enum(['pending', 'beta-checked']),
        evidence: id,
      }),
    }),
  ),
});
export function validateCatalog(modules: CurriculumModule[], lessons: Lesson[], input: unknown) {
  const editorial = editorialSchema.parse(input);
  const unique = (values: string[], what: string) => {
    if (new Set(values).size !== values.length) throw new Error(`Duplicate ${what}`);
  };
  unique(
    modules.map((m) => m.id),
    'module',
  );
  unique(
    lessons.map((l) => l.id),
    'lesson',
  );
  unique(
    editorial.sources.map((s) => s.id),
    'source',
  );
  unique(
    editorial.competencies.map((c) => c.id),
    'competency',
  );
  unique(
    editorial.lessons.map((l) => l.lessonId),
    'editorial record',
  );
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const moduleIds = new Set(modules.map((m) => m.id));
  const sourceIds = new Set(editorial.sources.map((s) => s.id));
  const competencies = new Map(editorial.competencies.map((c) => [c.id, c]));
  const records = new Map(editorial.lessons.map((r) => [r.lessonId, r]));
  for (const c of competencies.values())
    if (!moduleIds.has(c.moduleId)) throw new Error(`Unknown competency module ${c.id}`);
  for (const r of records.values())
    if (!byId.has(r.lessonId)) throw new Error(`Orphan editorial record ${r.lessonId}`);
  for (const l of lessons) {
    const m = modules.find((m) => m.id === l.moduleId);
    if (!m || m.level !== l.level) throw new Error(`Module/level mismatch ${l.id}`);
    const record = records.get(l.id);
    if (!record) throw new Error(`Missing editorial record ${l.id}`);
    if (l.status === 'beta' && record.review.status !== 'beta-checked')
      throw new Error(`Unreviewed beta ${l.id}`);
    unique(record.competencyIds, 'lesson competency');
    unique(record.prerequisiteIds, 'prerequisite');
    for (const id of record.competencyIds) {
      if (competencies.get(id)?.moduleId !== l.moduleId)
        throw new Error(`Invalid competency ${l.id}: ${id}`);
    }
    for (const claim of record.claims)
      for (const id of claim.sourceIds) {
        if (!sourceIds.has(id)) throw new Error(`Unknown source ${id}`);
        const source = editorial.sources.find((s) => s.id === id)!;
        if (!l.sources.some((s) => s.url === source.url))
          throw new Error(`Source absent from lesson ${l.id}: ${id}`);
      }
    for (const id of record.prerequisiteIds) {
      const prerequisite = byId.get(id);
      if (!prerequisite || (l.status === 'beta' && prerequisite.status !== 'beta'))
        throw new Error(`Unavailable prerequisite ${l.id}: ${id}`);
    }
  }
  const visited = new Set<string>(),
    active = new Set<string>();
  function visit(id: string) {
    if (active.has(id)) throw new Error(`Prerequisite cycle ${id}`);
    if (visited.has(id)) return;
    active.add(id);
    for (const dependency of records.get(id)!.prerequisiteIds) visit(dependency);
    active.delete(id);
    visited.add(id);
  }
  lessons.forEach((l) => visit(l.id));
  return {
    lessons: lessons.filter((l) => l.status === 'beta'),
    editorial,
    coverage: modules.map((m) => ({
      moduleId: m.id,
      betaLessonIds: lessons
        .filter((l) => l.moduleId === m.id && l.status === 'beta')
        .map((l) => l.id),
      registeredCompetencies: editorial.competencies.filter((c) => c.moduleId === m.id).length,
      // A registry entry or a beta lesson does not certify a complete module.
      complete: false as const,
    })),
  };
}
