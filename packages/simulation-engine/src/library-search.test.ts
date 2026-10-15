import { test, expect } from 'vitest';
import { librarySearch } from './library-search';
test('hand-calculated search counts, positions and every prefix remain consistent', () => {
  for (const [size, first, last] of [
    [8, 3, 4],
    [32, 5, 6],
    [128, 7, 8],
  ]) {
    for (const method of ['linear', 'binary'])
      for (const target of ['first', 'last', 'missing']) {
        const expected =
          method === 'linear'
            ? target === 'first'
              ? 1
              : size!
            : target === 'first'
              ? first!
              : last!;
        const full = librarySearch({ size, method, target, step: size, modelVersion: 1 });
        expect(full.total).toBe(expected);
        expect(full.finished).toBe(true);
        expect(full.found).toBe(target !== 'missing');
        expect(new Set(full.trace.map((r) => r.position)).size).toBe(expected);
        for (let step = 0; step <= expected; step++) {
          const partial = librarySearch({ size, method, target, step, modelVersion: 1 });
          expect(partial.trace).toEqual(full.trace.slice(0, step));
          expect(partial.step).toBe(step);
          expect(partial.finished).toBe(step === expected);
          for (const row of partial.trace) {
            expect(row.position).toBeGreaterThanOrEqual(1);
            expect(row.position).toBeLessThanOrEqual(size!);
            expect(row.value).toBe(row.position * 2);
          }
          if (!partial.finished && target !== 'missing') {
            const position = target === 'first' ? 1 : size!;
            expect(partial.low).toBeLessThanOrEqual(position);
            expect(partial.high).toBeGreaterThanOrEqual(position);
          }
        }
      }
  }
  expect(
    librarySearch({ method: 'binary', step: 8, modelVersion: 1 }).trace.map((r) => r.position),
  ).toEqual([4, 6, 7, 8]);
});
test('invalid or foreign checkpoints cannot forge the derived search result', () => {
  for (const step of [-1, 1.5, NaN, Infinity, 129, '8', null])
    expect(librarySearch({ step, modelVersion: 1 }).step).toBe(0);
  expect(librarySearch({ step: 8, modelVersion: 2 }).step).toBe(0);
  const input = {
    size: 8,
    method: 'binary',
    target: 'missing',
    step: 1,
    modelVersion: 1,
    found: true,
    total: 1,
    trace: 'forged',
  };
  const frozen = Object.freeze(input);
  const result = librarySearch(frozen);
  expect(result.finished).toBe(false);
  expect(result.found).toBe(false);
  expect(result.total).toBe(4);
  expect(result.trace[0]?.position).toBe(4);
  expect(librarySearch({ size: 1e9, method: 'other', target: 'bad' }).config).toEqual({
    size: 8,
    method: 'linear',
    target: 'last',
  });
});
