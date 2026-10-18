export const REPRESENTATION_MODEL_VERSION = 1;
function checkpoint(input: Record<string, unknown>) {
  return input.modelVersion === REPRESENTATION_MODEL_VERSION &&
    typeof input.step === 'number' &&
    Number.isInteger(input.step) &&
    input.step >= 0 &&
    input.step <= 2
    ? input.step
    : 0;
}
export function serializeRecord(input: Record<string, unknown>) {
  const sample =
    input.sample === 'vietnamese' || input.sample === 'quoted' ? input.sample : 'ascii';
  const pretty = input.pretty === true;
  const record = {
    name: sample === 'vietnamese' ? 'Bình' : sample === 'quoted' ? 'An, "B"' : 'An',
    seats: 2,
    confirmed: true,
  };
  const text = JSON.stringify(record, null, pretty ? 2 : undefined);
  const bytes = new TextEncoder().encode(text);
  const step = checkpoint(input);
  const decoded =
    step === 2 ? (JSON.parse(new TextDecoder().decode(bytes)) as typeof record) : null;
  return {
    config: { sample, pretty },
    record,
    text,
    bytes: Array.from(bytes),
    byteLength: bytes.length,
    step,
    decoded,
    finished: step === 2,
  };
}
export function compressRuns(input: Record<string, unknown>) {
  const pattern = input.pattern === 'alternating' ? 'alternating' : 'repeated';
  const raw = pattern === 'alternating' ? 'ABABABABABABABAB' : 'AAAAAAAABBBBBBBB';
  const pairs: { count: number; symbol: string }[] = [];
  for (const symbol of raw) {
    const last = pairs.at(-1);
    if (last?.symbol === symbol) last.count++;
    else pairs.push({ count: 1, symbol });
  }
  // Our fixed format: one unsigned count byte, one ASCII symbol byte, no header.
  const encoded = Uint8Array.from(pairs.flatMap((p) => [p.count, p.symbol.charCodeAt(0)]));
  const step = checkpoint(input);
  let restored = '';
  if (step === 2)
    for (let i = 0; i < encoded.length; i += 2)
      restored += String.fromCharCode(encoded[i + 1]!).repeat(encoded[i]!);
  return {
    config: { pattern },
    raw,
    rawBytes: new TextEncoder().encode(raw).length,
    pairs,
    encoded: Array.from(encoded),
    encodedBytes: encoded.length,
    restored: step === 2 ? restored : null,
    step,
    finished: step === 2,
  };
}
