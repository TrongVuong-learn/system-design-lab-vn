import { test, expect } from 'vitest';
import { hashTable } from './hash-table';
test('independent buckets and all lookup prefixes agree with hand-calculated cases', () => {
  for (const count of [4, 8])
    for (const method of ['hash', 'linear'])
      for (const target of ['first', 'last', 'missing']) {
        const total = target === 'first' ? 1 : method === 'linear' || count === 4 ? 4 : 2;
        const full = hashTable({ count, method, target, step: 4, modelVersion: 1 });
        expect(full.total).toBe(total);
        expect(full.step).toBe(total);
        expect(full.found).toBe(target !== 'missing');
        expect(full.buckets.filter((b) => b.keys.length).map((b) => [b.index, b.keys])).toEqual(
          count === 4
            ? [[2, [2, 6, 10, 14]]]
            : [
                [2, [2, 10]],
                [6, [6, 14]],
              ],
        );
        const keys = full.buckets.flatMap((b) => b.keys);
        expect([...keys].sort((a, b) => a - b)).toEqual([2, 6, 10, 14]);
        for (let step = 0; step <= total; step++) {
          const state = hashTable({ count, method, target, step, modelVersion: 1 });
          expect(state.trace).toEqual(full.trace.slice(0, step));
          expect(state.finished).toBe(step === total);
          if (method === 'hash')
            expect(state.trace.every((row) => row.key % count === state.bucket)).toBe(true);
          expect(state.trace.filter((row) => row.match).length).toBe(state.found ? 1 : 0);
        }
      }
  expect(
    hashTable({ count: 8, target: 'last', step: 4, modelVersion: 1 }).trace.map((r) => r.key),
  ).toEqual([6, 14]);
  expect(
    hashTable({ count: 8, target: 'missing', step: 4, modelVersion: 1 }).trace.map((r) => r.key),
  ).toEqual([2, 10]);
});
test('restore derives progress from a bounded versioned checkpoint and ignores forged results', () => {
  for (const step of [-1, 5, 1.5, NaN, Infinity, '4', null])
    expect(hashTable({ step, modelVersion: 1 }).step).toBe(0);
  expect(hashTable({ step: 4, modelVersion: 2 }).step).toBe(0);
  const input = Object.freeze({
    count: 8,
    method: 'hash',
    target: 'missing',
    step: 1,
    modelVersion: 1,
    found: true,
    total: 1,
    bucket: 7,
    trace: 'fake',
  });
  const state = hashTable(input);
  expect(state.found).toBe(false);
  expect(state.finished).toBe(false);
  expect(state.bucket).toBe(2);
  expect(state.total).toBe(2);
  expect(hashTable({ count: 1e9, method: 'fake', target: 'fake' }).config).toEqual({
    count: 4,
    method: 'hash',
    target: 'last',
  });
});
