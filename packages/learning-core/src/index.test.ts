import { describe, it, expect } from 'vitest';
import {
  emptyProgress,
  parseProgress,
  updateLesson,
  serializeProgress,
  MAX_PROGRESS_BYTES,
} from './index';
describe('learning checkpoints', () => {
  it('restores position, answers and experiment state without completing another lesson', () => {
    const p = updateLesson(emptyProgress(), 'cache', {
      stage: 2,
      actions: 3,
      lab: { source: 205, cached: 201 },
    });
    expect(parseProgress(serializeProgress(p))).toEqual(p);
    expect(p.lessons['queue']).toBeUndefined();
  });
  it('rejects unsupported versions and invalid stages on import', () => {
    expect(() => parseProgress('{"version":2,"lessons":{}}')).toThrow();
    expect(() => updateLesson(emptyProgress(), 'cache', { stage: 5 })).toThrow();
  });
});

it('counts the import limit in UTF-8 bytes, including Vietnamese text', () => {
  const oversized = JSON.stringify({ version: 1, lessons: {}, note: 'ệ'.repeat(700_000) });
  expect(oversized.length).toBeLessThan(MAX_PROGRESS_BYTES);
  expect(() => parseProgress(oversized)).toThrow('Bản lưu quá lớn');
  const boundary = JSON.stringify(emptyProgress()).padEnd(MAX_PROGRESS_BYTES, ' ');
  expect(parseProgress(boundary)).toEqual(emptyProgress());
  expect(() => parseProgress(boundary + ' ')).toThrow('Bản lưu quá lớn');
});

it('preserves independent optional hint levels through v1 export and accepts older saves', () => {
  const old = updateLesson(emptyProgress(), 'cache', { stage: 1 });
  expect(parseProgress(serializeProgress(old)).lessons['cache']?.hints).toBeUndefined();
  const hinted = updateLesson(old, 'cache', { hints: { prediction: 2, challenge: 0 } });
  const experimented = updateLesson(hinted, 'cache', { lab: { cached: 201, source: 205 } });
  expect(parseProgress(serializeProgress(experimented)).lessons['cache']?.hints).toEqual({
    prediction: 2,
    challenge: 0,
  });
  expect(() =>
    parseProgress(
      JSON.stringify({
        ...hinted,
        lessons: { cache: { ...hinted.lessons['cache'], hints: { prediction: 4, challenge: 0 } } },
      }),
    ),
  ).toThrow();
});

it('optional review checkpoints round-trip without changing lessons and old saves remain valid', async () => {
  const { newSchoolReviewProgress, updateSchoolReview } = await import('./index');
  const lesson = updateLesson(emptyProgress(), 'cache', {
    stage: 2,
    actions: 3,
    lab: { source: 205, cached: 201 },
  });
  expect(parseProgress(serializeProgress(lesson)).reviews).toBeUndefined();
  const review = newSchoolReviewProgress();
  review.configs.opening = { servers: 2, cache: true, ttl: 1, workers: 3 };
  review.runs.opening = { ...review.configs.opening };
  review.reflections.opening = 'Cache giảm đọc nguồn; worker xử lý việc gửi riêng.';
  review.hints.opening = 2;
  review.saved.opening = true;
  const next = updateSchoolReview(lesson, review),
    restored = parseProgress(serializeProgress(next));
  expect(restored).toEqual(next);
  expect(restored.lessons).toEqual(lesson.lessons);
  expect(updateLesson(next, 'queue', { stage: 1 }).reviews).toEqual(next.reviews);
  expect(() =>
    parseProgress(
      JSON.stringify({
        ...next,
        reviews: {
          'school-day': {
            ...review,
            configs: { ...review.configs, opening: { ...review.configs.opening, workers: -1 } },
          },
        },
      }),
    ),
  ).toThrow();
});
