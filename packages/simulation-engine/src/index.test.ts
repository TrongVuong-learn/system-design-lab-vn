import { it, expect, describe } from 'vitest';
import {
  initialCache,
  restoreCache,
  cacheStep,
  trafficStep,
  initialQueue,
  queueStep,
  initialReplica,
  replicaWrite,
  replicaTick,
  type CacheCommand,
} from './index';
describe('educational model invariants', () => {
  it('does not trust inconsistent or wrongly typed imported cache snapshots', () => {
    expect(restoreCache({ time: 'wrong', hits: 7 })).toEqual(initialCache());
    const valid = cacheStep(initialCache(), { type: 'read' });
    expect(restoreCache(valid)).toEqual(valid);
  });
  it('shows stale cache and refreshes exactly at expiry', () => {
    let s = cacheStep(initialCache(), { type: 'update', value: 205 });
    s = cacheStep(s, { type: 'read' });
    expect(s.last).toBe(201);
    for (let i = 0; i < 5; i++) s = cacheStep(s, { type: 'wait' });
    s = cacheStep(s, { type: 'read' });
    expect(s.last).toBe(205);
    expect(s.hits + s.misses).toBe(s.reads);
    expect(s.stale).toBe(1);
  });
  it('replays a command trace identically', () => {
    const commands: CacheCommand[] = [
      { type: 'update', value: 205 },
      { type: 'read' },
      { type: 'refresh' },
      { type: 'read' },
    ];
    const run = () => commands.reduce(cacheStep, initialCache());
    expect(run()).toEqual(run());
  });
  it('keeps downstream bottleneck when adding API servers', () => {
    const config = {
      arrivals: 12,
      servers: 1,
      serverCapacity: 6,
      databaseCapacity: 4,
      cacheHit: 0,
    };
    expect(trafficStep(config).completed).toBe(4);
    expect(trafficStep({ ...config, servers: 4 }).completed).toBe(4);
    const r = trafficStep({ ...config, servers: 4, cacheHit: 0.75 });
    expect(r.completed).toBe(12);
    expect(r.completed + r.waiting).toBe(12);
  });
  it('conserves queue jobs across changing load and workers', () => {
    let s = initialQueue();
    for (let i = 0; i < 8; i++) {
      s = queueStep(s, 7, i < 4 ? 1 : 4);
      expect(s.received).toBe(s.queued + s.processed);
    }
  });
  it('applies replica writes only after the configured lag', () => {
    let s = replicaWrite(initialReplica(), 205, 3);
    s = replicaTick(replicaTick(s));
    expect(s.replica).toBe(201);
    s = replicaTick(s);
    expect(s.replica).toBe(205);
  });
  it('keeps write order when the delay is changed for a later write', () => {
    let s = replicaWrite(initialReplica(), 205, 4);
    s = replicaTick(s);
    s = replicaWrite(s, 201, 1);
    s = replicaTick(replicaTick(replicaTick(s)));
    expect(s.replica).toBe(201);
    expect(s.pending).toHaveLength(0);
  });
});
