import { test, expect } from 'vitest';
import { priorityHeap } from './priority-heap';

test('independent output fixtures, heap order and ID conservation hold after every removal', () => {
  for (const method of ['heap', 'fifo']) {
    const order = method === 'heap' ? 'FCGAEDB' : 'ABCDEFG';
    for (let step = 0; step <= 7; step++) {
      const state = priorityHeap({ method, step, modelVersion: 1 });
      const removed = state.history.map((event) => event.removed);
      expect(removed.map((job) => job.id).join('')).toBe(order.slice(0, step));
      expect(state.waiting).toHaveLength(7 - step);
      expect(
        [...removed, ...state.waiting]
          .map((job) => job.id)
          .sort()
          .join(''),
      ).toBe('ABCDEFG');
      expect([...removed, ...state.waiting].map((job) => job.priority).sort()).toEqual([
        1, 2, 3, 4, 5, 6, 7,
      ]);
      expect(state.finished).toBe(step === 7);
      expect(state.next?.id).toBe(order[step]);
      if (method === 'heap') {
        for (let child = 1; child < state.waiting.length; child++)
          expect(state.waiting[Math.floor((child - 1) / 2)]!.priority).toBeLessThanOrEqual(
            state.waiting[child]!.priority,
          );
        if (state.next)
          expect(state.next.priority).toBe(Math.min(...state.waiting.map((j) => j.priority)));
      } else expect(state.waiting.map((job) => job.id).join('')).toBe('ABCDEFG'.slice(step));
    }
  }
});
test('level-order array is not sorted and first removal actually replaces then sifts down', () => {
  const initial = priorityHeap({});
  expect(initial.initial.map((j) => j.id).join('')).toBe('FECBDAG');
  expect(initial.waiting.map((j) => j.priority)).toEqual([1, 5, 2, 7, 6, 4, 3]);
  const one = priorityHeap({ step: 1, modelVersion: 1 });
  expect(one.waiting.map((j) => j.id).join('')).toBe('CEGBDA');
  expect(one.history[0]).toEqual({
    removed: { id: 'F', priority: 1 },
    replacement: { id: 'G', priority: 3 },
    swaps: [{ parent: { id: 'G', priority: 3 }, child: { id: 'C', priority: 2 } }],
  });
  expect(
    priorityHeap({ step: 2, modelVersion: 1 })
      .waiting.map((j) => j.id)
      .join(''),
  ).toBe('GEABD');
  expect(priorityHeap({ step: 7, modelVersion: 1 }).history.at(-1)).toEqual({
    removed: { id: 'B', priority: 7 },
    swaps: [],
  });
});
test('restore is bounded/versioned, ignores injected heap/output and does not mutate input', () => {
  for (const step of [-1, 8, 1.5, NaN, Infinity, '7', null])
    expect(priorityHeap({ step, modelVersion: 1 }).step).toBe(0);
  expect(priorityHeap({ step: 7, modelVersion: 2 }).step).toBe(0);
  const input = Object.freeze({
    method: 'heap',
    step: 1,
    modelVersion: 1,
    waiting: [],
    history: 'fake',
    finished: true,
  });
  expect(priorityHeap(input)).toMatchObject({ finished: false, next: { id: 'C', priority: 2 } });
  const changed = priorityHeap({});
  changed.waiting[0]!.priority = 99;
  expect(priorityHeap({ method: 'unknown' })).toMatchObject({
    config: { method: 'heap' },
    next: { id: 'F', priority: 1 },
  });
});
