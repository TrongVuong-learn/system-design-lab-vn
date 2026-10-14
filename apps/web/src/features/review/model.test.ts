import { it, expect } from 'vitest';
import { newSchoolReviewProgress } from '@sdl/learning-core';
import { isSchoolReviewSaved } from './model';
it('does not treat imported save flags or old results as evidence for a changed configuration', () => {
  const r = newSchoolReviewProgress();
  r.saved.opening = true;
  expect(isSchoolReviewSaved(r, 'opening')).toBe(false);
  r.configs.opening = { servers: 2, cache: true, ttl: 1, workers: 3 };
  r.runs.opening = { ...r.configs.opening };
  expect(isSchoolReviewSaved(r, 'opening')).toBe(false);
  r.reflections.opening = 'Một nhận định tự viết, không được máy chấm đúng.';
  expect(isSchoolReviewSaved(r, 'opening')).toBe(true);
  r.configs.opening.workers = 1;
  expect(isSchoolReviewSaved(r, 'opening')).toBe(false);
});
