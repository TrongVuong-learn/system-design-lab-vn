import { boundedNumber, trafficStep, queueStep, type QueueState } from './index';
export type SchoolScenarioId = 'opening' | 'rush';
export interface SchoolConfig {
  servers: number;
  cache: boolean;
  ttl: number;
  workers: number;
}
export const schoolScenarios = {
  opening: { readRate: 12, jobRate: 6, initialQueued: 0, seconds: 4, budget: 7, maxAgeMinutes: 1 },
  rush: { readRate: 6, jobRate: 8, initialQueued: 8, seconds: 4, budget: 8, maxAgeMinutes: 1 },
} as const;
export function normalizeSchoolConfig(input: Partial<SchoolConfig>): SchoolConfig {
  return {
    servers: boundedNumber(input.servers, 1, 1, 4),
    cache: input.cache === true,
    ttl: boundedNumber(input.ttl, 5, 1, 10),
    workers: boundedNumber(input.workers, 1, 1, 6),
  };
}
export function sameSchoolConfig(a: SchoolConfig, b: SchoolConfig) {
  return (
    a.servers === b.servers && a.cache === b.cache && a.ttl === b.ttl && a.workers === b.workers
  );
}
/** Authored, idealized review: fixed 75% hit assumption, separate read and notification streams. */
export function evaluateSchoolReview(id: SchoolScenarioId, input: SchoolConfig) {
  const scenario = schoolScenarios[id];
  if (!scenario) throw new Error('Unknown school review scenario');
  const config = normalizeSchoolConfig(input);
  const reads = trafficStep({
    arrivals: scenario.readRate,
    servers: config.servers,
    serverCapacity: 6,
    databaseCapacity: 4,
    cacheHit: config.cache ? 0.75 : 0,
  });
  let state: QueueState = {
    second: 0,
    queued: scenario.initialQueued,
    processed: 0,
    received: scenario.initialQueued,
  };
  const trace = [];
  for (let i = 0; i < scenario.seconds; i++) {
    const next = queueStep(state, scenario.jobRate, config.workers);
    trace.push({ ...next, doneThisSecond: next.processed - state.processed });
    state = next;
  }
  const cost = config.servers + config.workers + (config.cache ? 1 : 0);
  // Policy check only; not a measured freshness bound or a distributed consistency guarantee.
  const freshnessPolicy = !config.cache || config.ttl <= scenario.maxAgeMinutes;
  const checks = {
    reads: reads.waiting === 0,
    notifications: state.queued === 0,
    freshnessPolicy,
    budget: cost <= scenario.budget,
  };
  return {
    config,
    scenario,
    reads,
    queue: state,
    trace,
    cost,
    checks,
    passed: Object.values(checks).every(Boolean),
  };
}
