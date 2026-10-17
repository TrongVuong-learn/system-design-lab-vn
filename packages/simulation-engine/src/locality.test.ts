import { expect, it } from 'vitest';
import { memoryLocality, LOCALITY_MODEL_VERSION } from './locality';
const run = (pattern: string, blockSize: number, step = 8) =>
  memoryLocality({ pattern, blockSize, step, modelVersion: LOCALITY_MODEL_VERSION });
it('matches hand-calculated cold-cache outcomes for all six configurations', () => {
  expect(run('sequential', 4).trace.map((e) => e.hit)).toEqual([
    false,
    true,
    true,
    true,
    false,
    true,
    true,
    true,
  ]);
  expect(run('interleaved', 4).trace.map((e) => e.hit)).toEqual(Array(8).fill(false));
  for (const blockSize of [1, 4]) {
    expect(run('repeated', blockSize).loads).toBe(1);
    expect(run('repeated', blockSize).hits).toBe(7);
  }
  for (const pattern of ['sequential', 'interleaved']) expect(run(pattern, 1).loads).toBe(8);
});
it('replays every prefix with one resident block and preserves inputs', () => {
  for (const pattern of ['sequential', 'interleaved', 'repeated'])
    for (const blockSize of [1, 4])
      for (let step = 0; step <= 8; step++) {
        const state = run(pattern, blockSize, step);
        expect(state.trace).toEqual(run(pattern, blockSize).trace.slice(0, step));
        expect(state.hits + state.loads).toBe(step);
        expect(state.finished).toBe(step === 8);
        expect(state.cachedBlock).toBe(
          step ? Math.floor(state.addresses[step - 1]! / blockSize) : null,
        );
        state.trace.forEach((event, i) =>
          expect(event.hit).toBe(i > 0 && state.trace[i - 1]!.block === event.block),
        );
      }
  const input = {
    pattern: 'sequential',
    blockSize: 4,
    step: 4,
    modelVersion: 1,
    hits: 100,
    cachedBlock: 99,
  };
  const saved = structuredClone(input);
  expect(memoryLocality(input).hits).toBe(3);
  expect(input).toEqual(saved);
});
it('rejects malformed replay positions and unknown model versions', () => {
  for (const step of [-1, 9, 1.5, NaN, Infinity, '8', null])
    expect(memoryLocality({ step, modelVersion: 1 }).step).toBe(0);
  expect(memoryLocality({ step: 8, modelVersion: 2 }).step).toBe(0);
  expect(memoryLocality({ pattern: 'unknown', blockSize: 100 }).config).toEqual({
    pattern: 'sequential',
    blockSize: 4,
  });
});
