import { z } from 'zod';
import type { Lesson } from './index';
const ids = z.array(z.string().min(1)).min(1);
export const pathwaysSchema = z
  .object({
    version: z.literal(1),
    tracks: z
      .array(
        z
          .object({ id: z.string().regex(/^[a-z]+$/), title: z.string().min(1), lessonIds: ids })
          .strict(),
      )
      .length(7),
    capstones: ids.length(6),
    cases: ids.length(8),
  })
  .strict();

export function validatePathways(input: unknown, lessons: Lesson[]) {
  const pathways = pathwaysSchema.parse(input);
  const available = new Map(lessons.filter((l) => l.status === 'beta').map((l) => [l.id, l]));
  const unique = (values: string[]) => new Set(values).size === values.length;
  if (!unique(pathways.tracks.map((t) => t.id))) throw new Error('Duplicate track');
  for (const group of [
    ...pathways.tracks.map((t) => t.lessonIds),
    pathways.capstones,
    pathways.cases,
  ]) {
    if (!unique(group)) throw new Error('Duplicate pathway lesson');
    for (const id of group)
      if (!available.get(id)?.designTask)
        throw new Error(`Unavailable design pathway lesson: ${id}`);
  }
  pathways.capstones.forEach((id, index) => {
    if (available.get(id)?.level !== `L${index}`) throw new Error(`Capstone level mismatch: ${id}`);
  });
  return pathways;
}
