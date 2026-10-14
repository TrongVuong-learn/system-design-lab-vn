export const ENGINE_VERSION = '1.4.0';
export interface CacheState {
  time: number;
  source: number;
  cached: number | null;
  refreshedAt: number;
  ttl: number;
  reads: number;
  hits: number;
  misses: number;
  stale: number;
  last: number | null;
  message: string;
}
export type CacheCommand =
  | { type: 'read' | 'refresh' | 'wait' }
  | { type: 'update'; value: number }
  | { type: 'ttl'; value: number };
export const initialCache = (): CacheState => ({
  time: 0,
  source: 201,
  cached: 201,
  refreshedAt: 0,
  ttl: 5,
  reads: 0,
  hits: 0,
  misses: 0,
  stale: 0,
  last: null,
  message: 'Hai nơi đều đang ghi phòng 201. Hãy đổi lịch chính rồi xem bản ghi gần.',
});
export function restoreCache(input: unknown): CacheState {
  if (!input || typeof input !== 'object') return initialCache();
  const s = { ...initialCache(), ...input } as CacheState;
  const counters = [s.time, s.refreshedAt, s.reads, s.hits, s.misses, s.stale];
  if (
    !counters.every((n) => Number.isSafeInteger(n) && n >= 0) ||
    s.refreshedAt > s.time ||
    s.hits + s.misses !== s.reads ||
    s.stale > s.hits ||
    !Number.isInteger(s.ttl) ||
    s.ttl < 1 ||
    s.ttl > 10 ||
    ![201, 205].includes(s.source) ||
    ![null, 201, 205].includes(s.cached) ||
    ![null, 201, 205].includes(s.last) ||
    typeof s.message !== 'string'
  )
    return initialCache();
  return s;
}
export function boundedNumber(input: unknown, fallback: number, min: number, max: number): number {
  return typeof input === 'number' && Number.isInteger(input) && input >= min && input <= max
    ? input
    : fallback;
}
export function cacheStep(state: CacheState, command: CacheCommand): CacheState {
  const s = { ...state };
  if (command.type === 'update') {
    s.source = command.value;
    s.message = `Lịch chính đổi sang phòng ${s.source}. Bản ghi gần chưa thay đổi.`;
  }
  if (command.type === 'ttl') {
    if (!Number.isInteger(command.value) || command.value < 1 || command.value > 10)
      throw new Error('TTL outside supported range');
    s.ttl = command.value;
    s.message = `Bản ghi được dùng tối đa ${s.ttl} phút kể từ lần lấy mới.`;
  }
  if (command.type === 'wait') {
    s.time += 1;
    s.message = `Đồng hồ mô phỏng: phút ${s.time}. Bản ghi ${s.time - s.refreshedAt >= s.ttl ? 'đã hết hạn' : 'vẫn còn hạn'}.`;
  }
  if (command.type === 'refresh') {
    s.cached = s.source;
    s.refreshedAt = s.time;
    s.message = `Lấy lịch mới từ nguồn chính: bản ghi gần đổi thành ${s.cached}.`;
  }
  if (command.type === 'read') {
    s.reads += 1;
    if (s.cached !== null && s.time - s.refreshedAt < s.ttl) {
      s.hits += 1;
      s.last = s.cached;
      if (s.last !== s.source) s.stale += 1;
      s.message = `Bạn thấy phòng ${s.last}. Trang vừa đọc bản ghi gần${s.last !== s.source ? ', hiện vẫn cũ so với lịch chính' : ''}.`;
    } else {
      s.misses += 1;
      s.cached = s.source;
      s.refreshedAt = s.time;
      s.last = s.source;
      s.message = `Bản ghi gần hết hạn. Trang đọc lịch chính và cập nhật thành phòng ${s.source}.`;
    }
  }
  return s;
}
export interface TrafficConfig {
  arrivals: number;
  servers: number;
  serverCapacity: number;
  databaseCapacity: number;
  cacheHit: number;
}
export function trafficStep(c: TrafficConfig, backlog = 0) {
  const apiCapacity = c.servers * c.serverCapacity;
  const dbBound = c.cacheHit >= 1 ? Infinity : Math.floor(c.databaseCapacity / (1 - c.cacheHit));
  const capacity = Math.min(apiCapacity, dbBound);
  const offered = c.arrivals + backlog;
  const completed = Math.min(offered, capacity);
  return {
    arrivals: c.arrivals,
    completed,
    waiting: offered - completed,
    databaseReads: Math.round(completed * (1 - c.cacheHit)),
    capacity,
    bottleneck: apiCapacity <= dbBound ? 'máy xử lý' : 'nơi lưu dữ liệu',
  };
}
export interface QueueState {
  second: number;
  queued: number;
  processed: number;
  received: number;
}
export const initialQueue = (): QueueState => ({ second: 0, queued: 0, processed: 0, received: 0 });
export function queueStep(s: QueueState, arrivals: number, workers: number, rate = 2): QueueState {
  const done = Math.min(s.queued + arrivals, workers * rate);
  return {
    second: s.second + 1,
    queued: s.queued + arrivals - done,
    processed: s.processed + done,
    received: s.received + arrivals,
  };
}
export interface ReplicaState {
  time: number;
  primary: number;
  replica: number;
  pending: { at: number; value: number }[];
}
export const initialReplica = (): ReplicaState => ({
  time: 0,
  primary: 201,
  replica: 201,
  pending: [],
});
export function replicaWrite(s: ReplicaState, value: number, lag: number): ReplicaState {
  if (lag === 0) return { ...s, primary: value, replica: value, pending: [] };
  const at = Math.max(s.time + lag, s.pending.at(-1)?.at ?? s.time);
  return { ...s, primary: value, pending: [...s.pending, { at, value }] };
}
export function replicaTick(s: ReplicaState): ReplicaState {
  const time = s.time + 1;
  const ready = s.pending.filter((x) => x.at <= time);
  return {
    ...s,
    time,
    replica: ready.at(-1)?.value ?? s.replica,
    pending: s.pending.filter((x) => x.at > time),
  };
}

export function restoreQueue(input: unknown): QueueState {
  if (!input || typeof input !== 'object') return initialQueue();
  const state = { ...initialQueue(), ...input } as QueueState;
  if (
    ![state.second, state.received, state.processed, state.queued].every(
      (v) => Number.isSafeInteger(v) && v >= 0,
    ) ||
    state.received !== state.processed + state.queued
  )
    return initialQueue();
  return state;
}
export function restoreReplica(input: unknown): ReplicaState {
  if (!input || typeof input !== 'object') return initialReplica();
  const state = { ...initialReplica(), ...input } as ReplicaState;
  if (
    !Number.isSafeInteger(state.time) ||
    state.time < 0 ||
    ![201, 205].includes(state.primary) ||
    ![201, 205].includes(state.replica) ||
    !Array.isArray(state.pending) ||
    state.pending.length > 10
  )
    return initialReplica();
  let previous = state.time;
  for (const item of state.pending) {
    if (
      !item ||
      typeof item !== 'object' ||
      !Number.isSafeInteger(item.at) ||
      item.at <= state.time ||
      item.at < previous ||
      ![201, 205].includes(item.value)
    )
      return initialReplica();
    previous = item.at;
  }
  if (!state.pending.length && state.primary !== state.replica) return initialReplica();
  if (state.pending.length && state.pending.at(-1)?.value !== state.primary)
    return initialReplica();
  return state;
}

export {
  measureBatch,
  estimateCapacity,
  initialDns,
  restoreDns,
  dnsStep,
  transferPackets,
} from './foundations';

export { estimateDownload, httpExchange } from './network';

export { routePacket } from './routing';
export {
  observeCache,
  observeQueue,
  observeNetwork,
  parseObservation,
  type Observation,
} from './observations';
export { observeRemaining, type GuidedKind } from './remaining-observations';
export {
  schoolScenarios,
  normalizeSchoolConfig,
  sameSchoolConfig,
  evaluateSchoolReview,
  type SchoolConfig,
  type SchoolScenarioId,
} from './school-review';

export { normalizeTls, simulateTls, observeTls, TLS_MODEL_VERSION, type TlsConfig } from './tls';
