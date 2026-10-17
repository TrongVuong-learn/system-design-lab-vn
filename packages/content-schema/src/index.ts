import { z } from 'zod';
import { schoolReviewProgressSchema } from './review';

const question = z
  .object({
    text: z.string().min(8),
    options: z.array(z.string()).min(2),
    answer: z.number().int().nonnegative(),
    explanation: z.string().min(20),
  })
  .refine((q) => q.answer < q.options.length, 'Answer outside options');
const activityKind = z.enum([
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
  'http',
  'network',
  'routing',
  'tls',
  'concurrency',
  'cpu-io',
  'library-search',
  'hash-table',
  'search-tree',
]);
const caseText = z.string().trim().min(8).max(1600);
export const caseStudySchema = z
  .object({
    id: z.string().regex(/^case-[a-z][a-z0-9-]+$/),
    schemaVersion: z.literal(1),
    revision: z.number().int().positive(),
    familyId: z.string().regex(/^CASE-L[0-5]-0[1-6]$/),
    provenance: z.discriminatedUnion('kind', [
      z.object({ kind: z.literal('authored-scenario') }).strict(),
      z
        .object({
          kind: z.literal('documented-case'),
          sourceIds: z.array(z.string().min(1)).min(1),
          adaptationNote: caseText,
        })
        .strict(),
    ]),
    title: caseText,
    context: caseText,
    requirements: z.array(caseText).min(1).max(3),
    activityRef: activityKind,
    experimentSteps: z.array(caseText).min(1).max(3),
    assessmentRef: z.literal('challenge'),
    tradeoffs: z.array(caseText).min(1).max(3),
    limitations: caseText,
  })
  .strict();
export type CaseStudy = z.infer<typeof caseStudySchema>;
export const lessonSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]+$/),
  version: z.literal(1),
  status: z.enum(['draft', 'beta']),
  kind: activityKind,
  guidance: z
    .object({
      schemaVersion: z.literal(1),
      prediction: z.tuple([z.string().trim().min(8).max(500), z.string().trim().min(8).max(500)]),
      challenge: z.tuple([z.string().trim().min(8).max(500), z.string().trim().min(8).max(500)]),
    })
    .strict()
    .optional(),
  caseStudy: caseStudySchema.optional(),
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
  hints: z
    .object({
      prediction: z.number().int().min(0).max(3),
      challenge: z.number().int().min(0).max(3),
    })
    .strict()
    .optional(),
  lab: z.record(
    z.string(),
    z.union([z.string().max(2000), z.number().finite(), z.boolean(), z.null()]),
  ),
});
export const progressSchema = z.object({
  version: z.literal(1),
  lessons: z.record(z.string().max(100), lessonProgressSchema),
  reviews: z.object({ 'school-day': schoolReviewProgressSchema.optional() }).strict().optional(),
});
export type Progress = z.infer<typeof progressSchema>;
export type LessonProgress = z.infer<typeof lessonProgressSchema>;

export { validateCatalog, editorialSchema } from './catalog';

export {
  schoolConfigSchema,
  schoolReviewProgressSchema,
  reviewSchema,
  validateReviews,
  type SchoolReviewProgress,
  type Review,
} from './review';
