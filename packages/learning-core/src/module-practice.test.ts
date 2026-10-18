import { it, expect } from 'vitest';
import { evaluatePractice } from './module-practice';
const items = [
  { options: ['a', 'b'], answer: 1 },
  { options: ['a', 'b'], answer: 0 },
  { options: ['a', 'b', 'c'], answer: 2 },
];
const saved = (answers: unknown) => ({
  modelVersion: 1,
  practiceVersion: 1,
  answers: JSON.stringify(answers),
});
it('derives score and missing/wrong feedback without trusting stored pass flags', () => {
  expect(evaluatePractice(items, saved([1, 0, 2]))).toMatchObject({
    score: 3,
    answered: 3,
    passed: true,
  });
  expect(evaluatePractice(items, { ...saved([1, -1, 0]), passed: true, score: 3 })).toMatchObject({
    score: 1,
    answered: 2,
    passed: false,
    correct: [true, false, false],
  });
  expect(evaluatePractice([], saved([])).passed).toBe(false);
});
it('rejects malformed, out-of-range, stale or oversized answers atomically', () => {
  for (const input of [
    saved([1, 0]),
    saved([1, 0, 3]),
    saved([1, 0, 1.5]),
    saved([1, 0, '2']),
    { ...saved([1, 0, 2]), modelVersion: 2 },
    { ...saved([1, 0, 2]), practiceVersion: 2 },
    { modelVersion: 1, practiceVersion: 1, answers: '[' },
    { modelVersion: 1, practiceVersion: 1, answers: ' '.repeat(2001) },
  ])
    expect(evaluatePractice(items, input).answers).toEqual([-1, -1, -1]);
});
it('keeps checkpoints and questions immutable', () => {
  const input = saved([1, 0, 2]);
  const before = structuredClone(items);
  const state = evaluatePractice(items, input);
  state.answers[0] = 0;
  expect(items).toEqual(before);
  expect(input.answers).toBe('[1,0,2]');
});

it('v1 progress roundtrip retains a new lesson and its scalar practice checkpoint', async () => {
  const { parseProgress, serializeProgress, updateLesson, emptyProgress } = await import('./index');
  const progress = updateLesson(emptyProgress(), 'os-practice', {
    lab: { ...saved([1, 0, 2]), checked: true },
    stage: 2,
  });
  const restored = parseProgress(serializeProgress(progress));
  expect(evaluatePractice(items, restored.lessons['os-practice']!.lab).passed).toBe(true);
  expect(restored.version).toBe(1);
});

it('requires an explicit fresh check even when every selected answer is correct', () => {
  expect(evaluatePractice(items, saved([1, 0, 2])).ready).toBe(false);
  expect(evaluatePractice(items, { ...saved([1, 0, 2]), checked: true }).ready).toBe(true);
  expect(evaluatePractice(items, { ...saved([1, 1, 2]), checked: true }).ready).toBe(false);
});
