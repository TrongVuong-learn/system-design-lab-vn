export const SEARCH_MODEL_VERSION = 1;
export function librarySearch(input: Record<string, unknown>) {
  const size = [8, 32, 128].includes(input.size as number) ? (input.size as number) : 8;
  const method = input.method === 'binary' ? 'binary' : 'linear';
  const target = input.target === 'first' || input.target === 'missing' ? input.target : 'last';
  const wanted = target === 'first' ? 2 : target === 'last' ? size * 2 : size * 2 + 1;
  const trace: { position: number; value: number; low: number; high: number; reason: string }[] =
    [];
  let low = 0,
    high = size - 1,
    found = false;
  while (low <= high && !found) {
    const index = method === 'linear' ? low : Math.floor((low + high) / 2);
    const value = (index + 1) * 2;
    found = value === wanted;
    if (!found) {
      if (method === 'linear' || value < wanted) low = index + 1;
      else high = index - 1;
    }
    trace.push({
      position: index + 1,
      value,
      low: low + 1,
      high: high + 1,
      reason: found
        ? 'Mã trùng mục tiêu: đã tìm thấy.'
        : method === 'linear'
          ? 'Chưa trùng; xem mục kế tiếp.'
          : value < wanted
            ? 'Mã giữa nhỏ hơn mục tiêu; bỏ nửa bên trái và mục vừa xem.'
            : 'Mã giữa lớn hơn mục tiêu; bỏ nửa bên phải và mục vừa xem.',
    });
  }
  const valid =
    input.modelVersion === SEARCH_MODEL_VERSION &&
    typeof input.step === 'number' &&
    Number.isInteger(input.step) &&
    input.step >= 0 &&
    input.step <= size;
  const step = valid ? Math.min(input.step as number, trace.length) : 0;
  const visible = trace.slice(0, step);
  return {
    config: { size, method, target },
    wanted,
    step,
    trace: visible,
    total: trace.length,
    finished: step === trace.length,
    found: step === trace.length && found,
    low: visible.at(-1)?.low ?? 1,
    high: visible.at(-1)?.high ?? size,
  };
}
