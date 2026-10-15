import { it, expect } from 'vitest';
import {
  initialConcurrency,
  concurrencyStep,
  restoreConcurrency,
  observeConcurrency,
  type Actor,
} from './concurrency';
const schedules: [string, number][] = [
  ['aabb', 32],
  ['bbaa', 32],
  ['abab', 31],
  ['abba', 31],
  ['baab', 31],
  ['baba', 31],
];
it('enumerates all six unlocked order-preserving schedules with independent expected counts', () => {
  for (const [schedule, expected] of schedules) {
    let state = initialConcurrency();
    for (const actor of schedule) {
      const before = structuredClone(state);
      const next = concurrencyStep(state, actor as Actor).state;
      expect(state).toEqual(before);
      state = next;
    }
    expect(state.shared).toBe(expected);
    expect(state.stages).toEqual({ a: 2, b: 2 });
    expect(state.trace).toHaveLength(4);
    expect(concurrencyStep(state, 'a').state).toBe(state);
  }
});
it('checks every choice sequence up to eight actions: lock preserves ownership and final total', () => {
  for (let bits = 0; bits < 256; bits++) {
    let state = initialConcurrency(true);
    for (let i = 0; i < 8; i++) {
      const actor: Actor = (bits >> i) & 1 ? 'a' : 'b',
        before = state;
      const next = concurrencyStep(state, actor).state;
      if (before.owner && before.owner !== actor && before.stages[actor] !== 2)
        expect(next).toBe(before);
      if (next.owner) {
        expect(next.stages[next.owner]).toBe(1);
        expect(next.stages[next.owner === 'a' ? 'b' : 'a']).not.toBe(1);
      }
      expect(next.schedule.length).toBeLessThanOrEqual(4);
      if (next.stages.a === 2 && next.stages.b === 2) expect(next.shared).toBe(32);
      state = next;
    }
  }
});
it('wait does not read, consume a successful step or release another thread lock', () => {
  const a = concurrencyStep(initialConcurrency(true), 'a').state;
  const waiting = concurrencyStep(a, 'b');
  expect(waiting.state).toBe(a);
  expect(waiting.reason).toContain('phải chờ A');
  expect(a.locals.b).toBeNull();
  expect(a.owner).toBe('a');
  const written = concurrencyStep(a, 'a').state;
  expect(written.owner).toBeNull();
  expect(written.shared).toBe(31);
  const b = concurrencyStep(written, 'b').state;
  expect(b.locals.b).toBe(31);
  expect(b.owner).toBe('b');
  expect(
    observeConcurrency(a, waiting.state, waiting.reason).rows.every((r) => r.before === r.after),
  ).toBe(true);
});
it('replays each valid prefix and rejects malformed, impossible, foreign-version or overlong schedules', () => {
  for (const locked of [false, true])
    for (const [schedule] of schedules) {
      let state = initialConcurrency(locked);
      for (const actor of schedule) {
        state = concurrencyStep(state, actor as Actor).state;
        expect(
          restoreConcurrency({
            locked,
            modelVersion: 1,
            schedule: JSON.stringify(state.schedule),
            shared: 999,
            owner: 'wrong',
          }),
        ).toEqual(state);
      }
    }
  for (const schedule of ['bad', '{}', '["x"]', '["a","a","a"]', '["a","a","b","b","a"]', '[null]'])
    expect(restoreConcurrency({ locked: true, modelVersion: 1, schedule })).toEqual(
      initialConcurrency(true),
    );
  expect(restoreConcurrency({ locked: true, modelVersion: 1, schedule: '["a","b"]' })).toEqual(
    initialConcurrency(true),
  );
  expect(restoreConcurrency({ locked: true, modelVersion: 2, schedule: '["a"]' })).toEqual(
    initialConcurrency(true),
  );
  expect(restoreConcurrency({ locked: 'true', modelVersion: 1, schedule: '[]' })).toEqual(
    initialConcurrency(),
  );
});
