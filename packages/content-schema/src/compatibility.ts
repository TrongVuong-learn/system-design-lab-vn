import { z } from 'zod';
import type { Lesson } from './index';

// v1 progress stores answer indices and lab checkpoints by lesson ID. Until a
// migration exists, published IDs must retain these interpretation contracts.
const contract = z
  .object({
    lessonId: z.string().min(1),
    version: z.number().int().positive(),
    moduleId: z.string().min(1),
    kind: z.string().min(1),
    prediction: z.unknown(),
    challenge: z.unknown(),
    practice: z.unknown().optional(),
  })
  .strict();
export const compatibilitySchema = z
  .object({
    version: z.literal(1),
    progressVersion: z.literal(1),
    lessons: z.array(contract).min(1),
  })
  .strict();

export function lessonContract(lesson: Lesson) {
  return {
    lessonId: lesson.id,
    version: lesson.version,
    moduleId: lesson.moduleId,
    kind: lesson.kind,
    prediction: lesson.prediction,
    challenge: lesson.challenge,
    ...(lesson.practice ? { practice: lesson.practice } : {}),
  };
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value !== null && typeof value === 'object')
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stable(entry)}`)
      .join(',')}}`;
  return JSON.stringify(value) ?? 'undefined';
}

export function validateCompatibility(lessons: Lesson[], input: unknown) {
  const baseline = compatibilitySchema.parse(input);
  const ids = baseline.lessons.map((l) => l.lessonId);
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate compatibility lesson');
  for (const saved of baseline.lessons) {
    const lesson = lessons.find((l) => l.id === saved.lessonId);
    if (!lesson || lesson.status !== 'beta')
      throw new Error(`Published lesson unavailable: ${saved.lessonId}`);
    if (stable(lessonContract(lesson)) !== stable(saved))
      throw new Error(`Progress migration required: ${saved.lessonId}`);
  }
  for (const lesson of lessons.filter((l) => l.status === 'beta'))
    if (!ids.includes(lesson.id)) throw new Error(`Missing compatibility baseline: ${lesson.id}`);
  return baseline;
}
