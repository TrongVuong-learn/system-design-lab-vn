import { it, expect } from 'vitest';
import {
  evaluateSchoolReview,
  schoolScenarios,
  sameSchoolConfig,
  type SchoolConfig,
  type SchoolScenarioId,
} from './index';
it('default fails distinct read and notification goals, not every requirement', () => {
  const r = evaluateSchoolReview('opening', { servers: 1, cache: false, ttl: 5, workers: 1 });
  expect(r.reads.completed).toBe(4);
  expect(r.queue.queued).toBe(16);
  expect(r.checks).toEqual({
    reads: false,
    notifications: false,
    freshnessPolicy: true,
    budget: true,
  });
});
it('freshness policy is independent from capacity and hit assumption', () => {
  const c = { servers: 2, cache: true, ttl: 5, workers: 3 };
  const a = evaluateSchoolReview('opening', c),
    b = evaluateSchoolReview('opening', { ...c, ttl: 1 });
  expect(a.reads.completed).toBe(12);
  expect(a.queue.queued).toBe(0);
  expect(a.checks.freshnessPolicy).toBe(false);
  expect(b.passed).toBe(true);
  expect(b.reads).toEqual(a.reads);
  expect(b.cost).toBe(6);
});
it('matching arrival rate keeps old backlog; spare capacity drains it over four seconds', () => {
  const base = { servers: 1, cache: true, ttl: 1, workers: 4 };
  const balanced = evaluateSchoolReview('rush', base),
    spare = evaluateSchoolReview('rush', { ...base, workers: 5 });
  expect(balanced.trace.map((t) => t.queued)).toEqual([8, 8, 8, 8]);
  expect(balanced.checks.notifications).toBe(false);
  expect(spare.trace.map((t) => t.queued)).toEqual([6, 4, 2, 0]);
  expect(spare.queue.processed).toBe(40);
  expect(spare.cost).toBe(7);
  expect(spare.passed).toBe(true);
});
it('extra workers process only available jobs, and over-budget remains a separate failure', () => {
  const r = evaluateSchoolReview('rush', { servers: 1, cache: true, ttl: 1, workers: 6 });
  expect(r.trace.map((t) => t.doneThisSecond)).toEqual([12, 12, 8, 8]);
  expect(r.passed).toBe(true);
  const costly = evaluateSchoolReview('opening', { servers: 4, cache: true, ttl: 1, workers: 6 });
  expect(costly.queue.queued).toBe(0);
  expect(costly.checks.budget).toBe(false);
  expect(costly.passed).toBe(false);
});
it('has multiple feasible configurations and conserves jobs across every allowed configuration', () => {
  for (const id of ['opening', 'rush'] as SchoolScenarioId[]) {
    let feasible = 0;
    for (let servers = 1; servers <= 4; servers++)
      for (let workers = 1; workers <= 6; workers++)
        for (const cache of [false, true])
          for (let ttl = 1; ttl <= 10; ttl++) {
            const config: SchoolConfig = { servers, workers, cache, ttl };
            const r = evaluateSchoolReview(id, config);
            const s = schoolScenarios[id];
            expect(r.queue.received).toBe(s.initialQueued + s.jobRate * s.seconds);
            expect(r.queue.received).toBe(r.queue.processed + r.queue.queued);
            expect(r.trace.every((t) => t.queued >= 0 && t.doneThisSecond <= workers * 2)).toBe(
              true,
            );
            if (r.passed) feasible++;
          }
    expect(feasible).toBeGreaterThan(1);
  }
});
it('repeats independently, normalizes malformed parameters and compares actual configurations', () => {
  const c = { servers: 2, workers: 3, cache: true, ttl: 1 };
  expect(evaluateSchoolReview('opening', c)).toEqual(evaluateSchoolReview('opening', c));
  expect(sameSchoolConfig(c, { ...c, ttl: 2 })).toBe(false);
  const invalid = evaluateSchoolReview('opening', {
    servers: -9,
    workers: 99,
    cache: false,
    ttl: 0,
  });
  expect(invalid.config).toEqual({ servers: 1, workers: 1, cache: false, ttl: 5 });
});
