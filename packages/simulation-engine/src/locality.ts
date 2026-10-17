export const LOCALITY_MODEL_VERSION = 1;
export function memoryLocality(input: Record<string, unknown>) {
  const pattern =
    input.pattern === 'interleaved' || input.pattern === 'repeated' ? input.pattern : 'sequential';
  const blockSize = input.blockSize === 1 ? 1 : 4;
  const step =
    input.modelVersion === LOCALITY_MODEL_VERSION &&
    typeof input.step === 'number' &&
    Number.isInteger(input.step) &&
    input.step >= 0 &&
    input.step <= 8
      ? input.step
      : 0;
  const addresses =
    pattern === 'repeated'
      ? Array<number>(8).fill(0)
      : pattern === 'interleaved'
        ? [0, 4, 1, 5, 2, 6, 3, 7]
        : [0, 1, 2, 3, 4, 5, 6, 7];
  let cachedBlock: number | null = null;
  const trace: { address: number; block: number; hit: boolean; evicted: number | null }[] = [];
  for (const address of addresses.slice(0, step)) {
    const block = Math.floor(address / blockSize);
    const hit = cachedBlock === block;
    trace.push({ address, block, hit, evicted: hit ? null : cachedBlock });
    cachedBlock = block;
  }
  const hits = trace.filter((e) => e.hit).length;
  return {
    config: { pattern, blockSize },
    step,
    addresses,
    cachedBlock,
    trace,
    hits,
    loads: step - hits,
    finished: step === 8,
  };
}
