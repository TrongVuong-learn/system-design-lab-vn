import { test, expect } from 'vitest';
import { searchTree } from './search-tree';

test('six fixed lookups and every prefix match independent paths and decisions', () => {
  for (const [shape, target, expected] of [
    ['balanced', 'first', [8, 4, 2]],
    ['balanced', 'last', [8, 12, 14]],
    ['balanced', 'missing', [8, 12, 10]],
    ['skewed', 'first', [2]],
    ['skewed', 'last', [2, 4, 6, 8, 10, 12, 14]],
    ['skewed', 'missing', [2, 4, 6, 8, 10]],
  ] as const) {
    for (let step = 0; step <= 7; step++) {
      const state = searchTree({ shape, target, step, modelVersion: 1 });
      expect(state.trace.map((r) => r.key)).toEqual(expected.slice(0, step));
      expect(state.total).toBe(expected.length);
      expect(state.finished).toBe(step >= expected.length);
      expect(state.found).toBe(step >= expected.length && target !== 'missing');
      state.trace.forEach((row, i) => {
        expect(row.direction).toBe(
          row.key === state.wanted ? 'match' : row.key > state.wanted ? 'left' : 'right',
        );
        expect(row.next).toBe(expected[i + 1]);
      });
    }
  }
});

test('both shapes satisfy the whole-subtree ordering invariant and contain each key once', () => {
  for (const shape of ['balanced', 'skewed']) {
    const { root, nodes } = searchTree({ shape });
    const seen: number[] = [];
    function visit(key: number | undefined, min: number, max: number) {
      if (key === undefined) return;
      expect(seen).not.toContain(key);
      expect(key).toBeGreaterThan(min);
      expect(key).toBeLessThan(max);
      seen.push(key);
      const node = nodes.find((n) => n.key === key)!;
      expect(node).toBeDefined();
      visit(node.left, min, key);
      visit(node.right, key, max);
    }
    visit(root, -Infinity, Infinity);
    expect(seen.sort((a, b) => a - b)).toEqual([2, 4, 6, 8, 10, 12, 14]);
    expect(seen).toHaveLength(nodes.length);
  }
});

test('restore ignores forged traces/results and bounds/version-checks the checkpoint', () => {
  for (const step of [-1, 8, 1.1, NaN, Infinity, '7', null])
    expect(searchTree({ step, modelVersion: 1 }).step).toBe(0);
  expect(searchTree({ step: 7, modelVersion: 2 }).step).toBe(0);
  const input = Object.freeze({
    shape: 'skewed',
    target: 'missing',
    step: 2,
    modelVersion: 1,
    found: true,
    finished: true,
    trace: 'fake',
    total: 1,
  });
  expect(searchTree(input)).toMatchObject({ step: 2, total: 5, found: false, finished: false });
  const a = searchTree({});
  a.nodes[0]!.key = 999;
  expect(searchTree({ shape: 'fake', target: 'fake' })).toMatchObject({
    root: 8,
    step: 0,
    config: { shape: 'balanced', target: 'last' },
  });
});
