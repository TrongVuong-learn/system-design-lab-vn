import { expect, it } from 'vitest';
import { serializeRecord, compressRuns } from './representation';
it('serializes exact JSON bytes, preserves types and escapes quotes on roundtrip', () => {
  const ascii = serializeRecord({ step: 2, modelVersion: 1 });
  expect(ascii.text).toBe('{"name":"An","seats":2,"confirmed":true}');
  expect(ascii.byteLength).toBe(40);
  for (const sample of ['ascii', 'vietnamese', 'quoted'])
    for (const pretty of [true, false]) {
      const state = serializeRecord({ sample, pretty, step: 2, modelVersion: 1 });
      expect(state.decoded).toEqual(state.record);
      expect(typeof state.decoded!.seats).toBe('number');
      expect(typeof state.decoded!.confirmed).toBe('boolean');
      expect(state.bytes).toEqual(Array.from(new TextEncoder().encode(state.text)));
      expect(serializeRecord({ sample, pretty: true }).byteLength).toBeGreaterThan(
        serializeRecord({ sample }).byteLength,
      );
    }
  expect(serializeRecord({ sample: 'vietnamese' }).bytes).toContain(195);
  expect(serializeRecord({ sample: 'quoted' }).text).toContain('\\"B\\"');
});
it('RLE fixed binary pairs can shrink or expand, then restore the exact input', () => {
  const repeated = compressRuns({ step: 2, modelVersion: 1 });
  expect(repeated.encoded).toEqual([8, 65, 8, 66]);
  expect(repeated.rawBytes).toBe(16);
  expect(repeated.encodedBytes).toBe(4);
  const alternating = compressRuns({ pattern: 'alternating', step: 2, modelVersion: 1 });
  expect(alternating.encoded).toEqual(Array.from({ length: 8 }, () => [1, 65, 1, 66]).flat());
  expect(alternating.encodedBytes).toBe(32);
  for (const state of [repeated, alternating]) {
    expect(state.restored).toBe(state.raw);
    expect(state.pairs.reduce((n, p) => n + p.count, 0)).toBe(16);
  }
});
it('restores only supported bounded checkpoints, derives outputs and never mutates input', () => {
  for (const simulate of [serializeRecord, compressRuns]) {
    for (const step of [-1, 3, 1.5, Infinity, '2', null])
      expect(simulate({ step, modelVersion: 1 }).step).toBe(0);
    expect(simulate({ step: 2, modelVersion: 2 }).step).toBe(0);
    for (let step = 0; step <= 2; step++)
      expect(simulate({ step, modelVersion: 1 }).finished).toBe(step === 2);
    const input = { step: 2, modelVersion: 1, decoded: 'forged', restored: 'forged' };
    const saved = structuredClone(input);
    simulate(input);
    expect(input).toEqual(saved);
  }
  expect(serializeRecord({ step: 1, modelVersion: 1 }).decoded).toBeNull();
  expect(compressRuns({ step: 1, modelVersion: 1 }).restored).toBeNull();
});
