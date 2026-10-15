import type { Observation } from './observations';
export const CONCURRENCY_MODEL_VERSION = 1;
export type Actor = 'a' | 'b';
export type ConcurrencyState = {
  locked: boolean;
  shared: number;
  owner: Actor | null;
  stages: Record<Actor, 0 | 1 | 2>;
  locals: Record<Actor, number | null>;
  schedule: Actor[];
  trace: { actor: Actor; text: string; shared: number }[];
};
export function initialConcurrency(locked = false): ConcurrencyState {
  return {
    locked,
    shared: 30,
    owner: null,
    stages: { a: 0, b: 0 },
    locals: { a: null, b: null },
    schedule: [],
    trace: [],
  };
}
export function concurrencyStep(state: ConcurrencyState, actor: Actor) {
  const name = actor.toUpperCase();
  if (state.stages[actor] === 2)
    return { state, reason: `${name} đã ghi xong; không cộng thêm lần nữa.` };
  if (state.locked && state.owner && state.owner !== actor)
    return {
      state,
      reason: `${name} phải chờ ${state.owner.toUpperCase()} ghi xong và trả khóa. Số chung và số đã đọc đều chưa đổi.`,
    };
  const reading = state.stages[actor] === 0;
  const local = state.locals[actor];
  const shared = reading ? state.shared : local! + 1;
  const reason = reading
    ? `${name} đọc ${state.shared} vào ô riêng.${state.locked ? ` ${name} giữ khóa cho cả đoạn đọc–tăng–ghi.` : ''} Chưa đổi số chung.`
    : `${name} dùng số đã đọc ${local}, cộng 1 rồi ghi ${shared}.${state.shared !== local ? ` Số chung đã là ${state.shared}, nhưng ${name} vẫn tính từ số cũ ${local}; một cập nhật bị ghi đè.` : ''}${state.locked ? ` ${name} trả khóa sau khi ghi.` : ''}`;
  const next: ConcurrencyState = {
    ...state,
    shared,
    owner: state.locked && reading ? actor : null,
    stages: { ...state.stages, [actor]: reading ? 1 : 2 },
    locals: { ...state.locals, [actor]: reading ? state.shared : local },
    schedule: [...state.schedule, actor],
    trace: [...state.trace, { actor, text: reason, shared }],
  };
  return { state: next, reason };
}
/** Rebuild from <=4 accepted steps; never trust imported counter/local/owner fields. */
export function restoreConcurrency(input: Record<string, unknown>): ConcurrencyState {
  const locked = input['locked'] === true;
  const initial = initialConcurrency(locked);
  if (input['schedule'] === undefined) return initial;
  if (input['modelVersion'] !== CONCURRENCY_MODEL_VERSION || typeof input['schedule'] !== 'string')
    return initial;
  try {
    const commands: unknown = JSON.parse(input['schedule']);
    if (!Array.isArray(commands) || commands.length > 4) return initial;
    let state = initial;
    for (const command of commands) {
      if (command !== 'a' && command !== 'b') return initial;
      const next = concurrencyStep(state, command).state;
      if (next.schedule.length !== state.schedule.length + 1) return initial;
      state = next;
    }
    return state;
  } catch {
    return initial;
  }
}
export function observeConcurrency(
  before: ConcurrencyState,
  after: ConcurrencyState,
  reason: string,
): Observation {
  const read = (v: number | null) => (v === null ? 'Chưa đọc' : String(v));
  return {
    schemaVersion: 1,
    action: 'Một bước của luồng được chọn',
    rows: [
      { label: 'Số chung', before: String(before.shared), after: String(after.shared) },
      { label: 'A đã đọc', before: read(before.locals.a), after: read(after.locals.a) },
      { label: 'B đã đọc', before: read(before.locals.b), after: read(after.locals.b) },
    ],
    reason,
  };
}
