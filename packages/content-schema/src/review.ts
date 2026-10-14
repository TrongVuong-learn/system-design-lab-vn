import { z } from 'zod';
export const schoolConfigSchema = z
  .object({
    servers: z.number().int().min(1).max(4),
    cache: z.boolean(),
    ttl: z.number().int().min(1).max(10),
    workers: z.number().int().min(1).max(6),
  })
  .strict();
const configs = z.object({ opening: schoolConfigSchema, rush: schoolConfigSchema }).strict();
const runs = z
  .object({ opening: schoolConfigSchema.optional(), rush: schoolConfigSchema.optional() })
  .strict();
export const schoolReviewProgressSchema = z
  .object({
    version: z.literal(1),
    scenarioId: z.enum(['opening', 'rush']),
    configs,
    runs,
    previousRuns: runs,
    reflections: z.object({ opening: z.string().max(1000), rush: z.string().max(1000) }).strict(),
    hints: z
      .object({ opening: z.number().int().min(0).max(2), rush: z.number().int().min(0).max(2) })
      .strict(),
    saved: z.object({ opening: z.boolean(), rush: z.boolean() }).strict(),
  })
  .strict();
export type SchoolReviewProgress = z.infer<typeof schoolReviewProgressSchema>;
const text = z.string().trim().min(8).max(1600);
export const reviewSchema = z
  .object({
    id: z.literal('school-day'),
    version: z.literal(1),
    status: z.enum(['draft', 'beta']),
    activityRef: z.literal('school-review'),
    title: text,
    subtitle: text,
    prerequisiteIds: z.array(z.string()).min(3).max(4),
    introduction: text,
    scenarios: z.tuple([
      z
        .object({
          id: z.literal('opening'),
          title: text,
          context: text,
          hints: z.tuple([text, text]),
          reflectionPrompt: text,
        })
        .strict(),
      z
        .object({
          id: z.literal('rush'),
          title: text,
          context: text,
          hints: z.tuple([text, text]),
          reflectionPrompt: text,
        })
        .strict(),
    ]),
    limits: z.array(text).min(3).max(8),
    sources: z
      .array(
        z.object({ title: text, url: z.url(), checkedAt: z.iso.date(), supports: text }).strict(),
      )
      .min(1),
    review: z
      .object({
        reviewer: text,
        reviewerType: z.enum(['agent', 'human']),
        date: z.iso.date(),
        status: z.enum(['pending', 'beta-checked']),
        evidence: text,
      })
      .strict(),
  })
  .strict();
export type Review = z.infer<typeof reviewSchema>;
export function validateReviews(input: unknown, lessonIds: string[]) {
  const reviews = z.array(reviewSchema).parse(input);
  if (new Set(reviews.map((r) => r.id)).size !== reviews.length)
    throw new Error('Duplicate review ID');
  for (const review of reviews) {
    if (review.status === 'beta' && review.review.status !== 'beta-checked')
      throw new Error('Unreviewed beta review');
    if (
      new Set(review.prerequisiteIds).size !== review.prerequisiteIds.length ||
      review.prerequisiteIds.some((id) => !lessonIds.includes(id))
    )
      throw new Error('Invalid review prerequisite');
  }
  return reviews.filter((r) => r.status === 'beta');
}
