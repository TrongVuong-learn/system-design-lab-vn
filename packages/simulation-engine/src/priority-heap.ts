export const HEAP_MODEL_VERSION = 1;
export interface HeapJob {
  id: string;
  priority: number;
}
export interface HeapRemoval {
  removed: HeapJob;
  replacement?: HeapJob;
  swaps: { parent: HeapJob; child: HeapJob }[];
}
function arrive() {
  return [4, 7, 2, 6, 5, 1, 3].map((priority, index) => ({
    id: String.fromCharCode(65 + index),
    priority,
  }));
}
function buildHeap(jobs: HeapJob[]) {
  const heap: HeapJob[] = [];
  for (const job of jobs) {
    heap.push(job);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent]!.priority <= heap[i]!.priority) break;
      [heap[parent], heap[i]] = [heap[i]!, heap[parent]!];
      i = parent;
    }
  }
  return heap;
}
function removeMin(heap: HeapJob[]): HeapRemoval {
  const removed = heap[0]!;
  const last = heap.pop()!;
  const swaps: HeapRemoval['swaps'] = [];
  if (!heap.length) return { removed, swaps };
  heap[0] = last;
  let i = 0;
  while (2 * i + 1 < heap.length) {
    let child = 2 * i + 1;
    if (child + 1 < heap.length && heap[child + 1]!.priority < heap[child]!.priority) child++;
    if (heap[i]!.priority <= heap[child]!.priority) break;
    swaps.push({ parent: heap[i]!, child: heap[child]! });
    [heap[i], heap[child]] = [heap[child]!, heap[i]!];
    i = child;
  }
  return { removed, replacement: last, swaps };
}
export function priorityHeap(input: Record<string, unknown>) {
  const method = input.method === 'fifo' ? 'fifo' : 'heap';
  const step =
    input.modelVersion === HEAP_MODEL_VERSION &&
    typeof input.step === 'number' &&
    Number.isInteger(input.step) &&
    input.step >= 0 &&
    input.step <= 7
      ? input.step
      : 0;
  const arrivals = arrive();
  const waiting = method === 'heap' ? buildHeap(arrivals) : [...arrivals];
  const initial = [...waiting];
  const history: HeapRemoval[] = [];
  for (let i = 0; i < step; i++)
    history.push(method === 'heap' ? removeMin(waiting) : { removed: waiting.shift()!, swaps: [] });
  return {
    config: { method },
    step,
    arrivals,
    initial,
    waiting,
    history,
    next: waiting[0],
    finished: waiting.length === 0,
  };
}
