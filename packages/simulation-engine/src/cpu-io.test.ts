import { it, expect } from 'vitest';
import { simulateCpuIo, restoreCpuIo, observeCpuIo } from './cpu-io';
const cases = [
  {
    mode: 'io',
    workers: 1,
    time: 10,
    busy: 4,
    idle: 6,
    doneAt: [5, 10],
    cpu: ['A', null, null, null, 'A', 'B', null, null, null, 'B'],
  },
  {
    mode: 'io',
    workers: 2,
    time: 6,
    busy: 4,
    idle: 2,
    doneAt: [5, 6],
    cpu: ['A', 'B', null, null, 'A', 'B'],
  },
  {
    mode: 'cpu',
    workers: 1,
    time: 8,
    busy: 8,
    idle: 0,
    doneAt: [4, 8],
    cpu: ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B'],
  },
  {
    mode: 'cpu',
    workers: 2,
    time: 8,
    busy: 8,
    idle: 0,
    doneAt: [4, 8],
    cpu: ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B'],
  },
];
it('matches independent complete interval schedules for all four authored workloads', () => {
  for (const c of cases) {
    const input = { mode: c.mode, workers: c.workers, step: 10 };
    const before = structuredClone(input);
    const r = simulateCpuIo(input);
    expect(input).toEqual(before);
    expect({ time: r.time, busy: r.busy, idle: r.idle }).toEqual({
      time: c.time,
      busy: c.busy,
      idle: c.idle,
    });
    expect(r.jobs.map((j) => j.doneAt)).toEqual(c.doneAt);
    expect(r.timeline.map((t) => t.cpu)).toEqual(c.cpu);
    expect(r.finished).toBe(true);
  }
});
it('validates each prefix, single CPU, bounded worker slots, IO duration and correct elapsed boundaries', () => {
  for (const c of cases)
    for (let step = 0; step <= 10; step++) {
      const r = simulateCpuIo({ ...c, step });
      expect(r.time).toBe(Math.min(step, c.time));
      expect(r.timeline).toHaveLength(r.time);
      expect(r.busy + r.idle).toBe(r.time);
      expect(
        r.jobs.filter((j) => !['queued', 'done'].includes(j.phase)).length,
      ).toBeLessThanOrEqual(c.workers);
      for (const t of r.timeline) {
        expect(t.end - t.start).toBe(1);
        expect(t.states.filter((s) => s.text === 'CPU xử lý').length).toBe(t.cpu ? 1 : 0);
        if (!t.cpu) expect(t.states.every((s) => s.text !== 'Chờ CPU')).toBe(true);
        expect(
          t.states.filter((s) => s.text !== 'Chờ worker' && s.text !== 'Xong').length,
        ).toBeLessThanOrEqual(c.workers);
      }
      if (r.finished)
        for (const id of ['A', 'B']) {
          expect(r.timeline.filter((t) => t.cpu === id)).toHaveLength(c.mode === 'io' ? 2 : 4);
          expect(
            r.timeline.filter((t) => t.states.some((s) => s.id === id && s.text === 'Chờ I/O')),
          ).toHaveLength(c.mode === 'io' ? 3 : 0);
        }
    }
});
it('keeps waiting for worker distinct from IO and CPU readiness at event boundaries', () => {
  const before = simulateCpuIo({ mode: 'io', workers: 1, step: 1 });
  expect(before.jobs.map((j) => j.phase)).toEqual(['io', 'queued']);
  const two = simulateCpuIo({ mode: 'io', workers: 2, step: 2 });
  expect(two.jobs.map((j) => j.phase)).toEqual(['io', 'io']);
  expect(two.jobs.map((j) => j.remaining)).toEqual([2, 3]);
  const ready = simulateCpuIo({ mode: 'io', workers: 2, step: 4 });
  expect(ready.jobs.map((j) => j.phase)).toEqual(['last', 'io']);
  const admitted = simulateCpuIo({ mode: 'io', workers: 1, step: 5 });
  expect(admitted.jobs.map((j) => j.phase)).toEqual(['done', 'first']);
  expect(admitted.jobs[1]!.doneAt).toBeNull();
  expect(observeCpuIo(before, simulateCpuIo({ mode: 'io', workers: 1, step: 2 })).reason).toContain(
    'CPU nghỉ',
  );
});
it('restores only bounded versioned steps and ignores forged imported state', () => {
  for (const c of cases)
    for (let step = 0; step <= 10; step++)
      expect(
        restoreCpuIo({ ...c, modelVersion: 1, step, time: 999, finished: true, jobs: [] }),
      ).toEqual(simulateCpuIo({ ...c, step }));
  for (const step of [-1, 99, 1.5, '6', null, NaN, Infinity])
    expect(restoreCpuIo({ mode: 'io', workers: 2, modelVersion: 1, step }).time).toBe(0);
  expect(restoreCpuIo({ mode: 'cpu', workers: 2, modelVersion: 9, step: 8 }).time).toBe(0);
  expect(restoreCpuIo({ mode: 'bad', workers: '2', modelVersion: 1, step: 0 }).config).toEqual({
    mode: 'io',
    workers: 1,
  });
});
