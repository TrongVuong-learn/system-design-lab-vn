import { z } from 'zod';

const question = z
  .object({
    text: z.string().min(8),
    options: z.array(z.string()).min(2),
    answer: z.number().int().nonnegative(),
    explanation: z.string().min(20),
  })
  .refine((q) => q.answer < q.options.length, 'Answer outside options');
export const lessonSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]+$/),
  version: z.literal(1),
  status: z.enum(['draft', 'beta']),
  kind: z.enum([
    'request',
    'balance',
    'cache',
    'queue',
    'replica',
    'design',
    'metrics',
    'dns',
    'transport',
    'capacity',
  ]),
  level: z.string().regex(/^L[0-5]$/),
  moduleId: z.string().regex(/^L[0-5]\.[1-6]$/),
  title: z.string(),
  subtitle: z.string(),
  minutes: z.number().positive(),
  objective: z.string(),
  story: z.string(),
  explanation: z.string(),
  limit: z.string(),
  terms: z.array(z.object({ name: z.string(), english: z.string(), meaning: z.string() })),
  prediction: question,
  challenge: question,
  sources: z.array(z.object({ title: z.string(), url: z.url() })).min(1),
});
export type Lesson = z.infer<typeof lessonSchema>;
export const moduleSchema = z.object({
  id: z.string(),
  level: z.string(),
  title: z.string(),
  topics: z.string(),
});
export type CurriculumModule = z.infer<typeof moduleSchema>;
export const lessonProgressSchema = z.object({
  stage: z.number().int().min(0).max(3),
  prediction: z.number().int().min(-1).max(10),
  challenge: z.number().int().min(-1).max(10),
  actions: z.number().int().nonnegative(),
  completed: z.boolean(),
  lab: z.record(
    z.string(),
    z.union([z.string().max(2000), z.number().finite(), z.boolean(), z.null()]),
  ),
});
export const progressSchema = z.object({
  version: z.literal(1),
  lessons: z.record(z.string().max(100), lessonProgressSchema),
});
export type Progress = z.infer<typeof progressSchema>;
export type LessonProgress = z.infer<typeof lessonProgressSchema>;

export { validateCatalog, editorialSchema } from './catalog';
