import { it, expect } from 'vitest';
import source from '../../../content/reviews/vi/school-day.json';
import { validateReviews, reviewSchema, schoolReviewProgressSchema } from './review';
it('validates the reviewed activity and references existing prerequisites', () => {
  expect(validateReviews(source, ['balance', 'cache', 'queue'])).toHaveLength(1);
  expect(() => validateReviews(source, ['cache', 'queue'])).toThrow('prerequisite');
  expect(() => validateReviews([...source, ...source], ['balance', 'cache', 'queue'])).toThrow(
    'Duplicate',
  );
});
it('rejects unreviewed beta, executable fields and unknown scenario or activity IDs', () => {
  const r = structuredClone(source[0]!);
  r.review.status = 'pending';
  expect(() => validateReviews([r], ['balance', 'cache', 'queue'])).toThrow('Unreviewed');
  expect(() => reviewSchema.parse({ ...source[0], code: 'alert(1)' })).toThrow();
  expect(() => reviewSchema.parse({ ...source[0], activityRef: 'arbitrary-code' })).toThrow();
  expect(() =>
    reviewSchema.parse({
      ...source[0],
      scenarios: [{ ...source[0]!.scenarios[0], id: 'unknown' }, source[0]!.scenarios[1]],
    }),
  ).toThrow();
  expect(() => schoolReviewProgressSchema.parse({ version: 2 })).toThrow();
});
