/** Discrete teaching games. All quantities are fictional workload units, not benchmarks. */
export const GAME_VERSION = 1;
export const GAME_IDS = ['balance', 'cache', 'queue'] as const;
export type GameId = (typeof GAME_IDS)[number];
export type GameState = { id: GameId; actions: number[] };
export const gameInputs = {
  balance: [3, 2, 4, 1, 2, 4],
  cache: [1, 1, 2, 2, 3, 3],
  queue: [2, 6, 1, 5, 2, 0],
};
export function gameResult(state: GameState) {
  let loads = [0, 0];
  let cached = 0;
  let correct = 0;
  let cost = 0;
  let waiting = 0;
  let served = 0;
  let lost = 0;
  const trace: string[] = [];
  for (const [turn, action] of state.actions.entries()) {
    const input = gameInputs[state.id][turn];
    if (input === undefined) break;
    if (state.id === 'balance') {
      loads = loads.map((value, index) => value + (index === action ? input : 0));
      trace.push(
        `Gói ${input} đơn vị → máy ${action === 0 ? 'A' : 'B'}. Tổng tải A: ${loads[0]}, B: ${loads[1]}.`,
      );
    } else if (state.id === 'cache') {
      const fresh = action === 1 || cached === input;
      correct += Number(fresh);
      cost += action === 1 ? 3 : 1;
      if (action === 1) cached = input;
      trace.push(
        `${action === 1 ? 'Nguồn gốc' : 'Cache'} trả ${fresh ? 'đúng' : 'sai'} phiên bản. Nguồn đang là v${input}, cache ${cached ? `v${cached}` : 'trống'}. Tốn ${action === 1 ? 3 : 1} đơn vị chi phí.`,
      );
    } else {
      const workers = action + 1;
      // Arrivals enter a six-place queue BEFORE service in each discrete turn.
      const overflow = Math.max(0, waiting + input - 6);
      waiting = Math.min(6, waiting + input);
      const finished = Math.min(waiting, workers * 2);
      waiting -= finished;
      served += finished;
      lost += overflow;
      cost += workers;
      trace.push(
        `${input} việc đến; ${workers} worker xử lý ${finished}. Còn chờ ${waiting}, mất ${overflow}, tốn ${workers} đơn vị chi phí.`,
      );
    }
  }
  const done = state.actions.length === 6;
  const won =
    done &&
    (state.id === 'balance'
      ? Math.max(...loads) === 8
      : state.id === 'cache'
        ? correct === 6 && cost <= 12
        : served === 16 && lost === 0 && waiting === 0 && cost <= 8);
  return { loads, cached, correct, cost, waiting, served, lost, trace, done, won };
}
export function playGame(state: GameState, action: number): GameState {
  const limit = state.id === 'queue' ? 3 : 2;
  if (state.actions.length >= 6 || !Number.isInteger(action) || action < 0 || action >= limit)
    return state;
  return { ...state, actions: [...state.actions, action] };
}
export function parseGame(value: unknown, id: GameId): GameState {
  if (typeof value !== 'object' || value === null) return { id, actions: [] };
  const s = value as Record<string, unknown>;
  if (
    s.id !== id ||
    !Array.isArray(s.actions) ||
    s.actions.length > 6 ||
    s.actions.some((a) => !Number.isInteger(a) || a < 0 || a >= (id === 'queue' ? 3 : 2))
  )
    return { id, actions: [] };
  return { id, actions: [...s.actions] as number[] };
}
