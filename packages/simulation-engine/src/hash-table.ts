export const HASH_MODEL_VERSION = 1;
const keys = [2, 6, 10, 14] as const;
export function hashTable(input: Record<string, unknown>) {
  const count = input.count === 8 ? 8 : 4;
  const method = input.method === 'linear' ? 'linear' : 'hash';
  const target = input.target === 'first' || input.target === 'missing' ? input.target : 'last';
  const wanted = target === 'first' ? 2 : target === 'missing' ? 18 : 14;
  const buckets = Array.from({ length: count }, (_, index) => ({
    index,
    keys: keys.filter((key) => key % count === index),
  }));
  const bucket = wanted % count;
  const candidates = method === 'linear' ? [...keys] : [...buckets[bucket]!.keys];
  const match = candidates.indexOf(wanted as (typeof keys)[number]);
  const total = match < 0 ? candidates.length : match + 1;
  const step =
    input.modelVersion === HASH_MODEL_VERSION &&
    typeof input.step === 'number' &&
    Number.isInteger(input.step) &&
    input.step >= 0 &&
    input.step <= 4
      ? Math.min(input.step, total)
      : 0;
  return {
    config: { count, method, target },
    wanted,
    bucket,
    buckets,
    step,
    total,
    trace: candidates.slice(0, step).map((key) => ({ key, match: key === wanted })),
    finished: step === total,
    found: step === total && match >= 0,
  };
}
