export const TREE_MODEL_VERSION = 1;
export interface SearchNode {
  key: number;
  left?: number;
  right?: number;
}
export function searchTree(input: Record<string, unknown>) {
  const shape = input.shape === 'skewed' ? 'skewed' : 'balanced';
  const target = input.target === 'first' || input.target === 'missing' ? input.target : 'last';
  const wanted = target === 'first' ? 2 : target === 'missing' ? 9 : 14;
  const nodes: SearchNode[] =
    shape === 'balanced'
      ? [
          { key: 8, left: 4, right: 12 },
          { key: 4, left: 2, right: 6 },
          { key: 12, left: 10, right: 14 },
          { key: 2 },
          { key: 6 },
          { key: 10 },
          { key: 14 },
        ]
      : [2, 4, 6, 8, 10, 12, 14].map((key, i, keys) => ({ key, right: keys[i + 1] }));
  const root = nodes[0]!.key;
  const path: { key: number; direction: 'left' | 'right' | 'match'; next: number | undefined }[] =
    [];
  let key: number | undefined = root;
  while (key !== undefined) {
    const node = nodes.find((n) => n.key === key)!;
    const direction: 'left' | 'right' | 'match' =
      wanted === key ? 'match' : wanted < key ? 'left' : 'right';
    const next: number | undefined = direction === 'match' ? undefined : node[direction];
    path.push({ key, direction, next });
    key = next;
  }
  const step =
    input.modelVersion === TREE_MODEL_VERSION &&
    typeof input.step === 'number' &&
    Number.isInteger(input.step) &&
    input.step >= 0 &&
    input.step <= 7
      ? Math.min(input.step, path.length)
      : 0;
  const finished = step === path.length;
  return {
    config: { shape, target },
    wanted,
    nodes,
    root,
    step,
    total: path.length,
    trace: path.slice(0, step),
    finished,
    found: finished && path.at(-1)!.direction === 'match',
  };
}
