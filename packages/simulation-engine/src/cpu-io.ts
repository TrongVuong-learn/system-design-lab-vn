import type { Observation } from './observations';
export const CPU_IO_MODEL_VERSION = 1;
export type CpuIoConfig = { mode: 'io' | 'cpu'; workers: 1 | 2 };
type Phase = 'queued' | 'first' | 'io' | 'last' | 'done';
type Job = { id: 'A' | 'B'; phase: Phase; remaining: number; doneAt: number | null };
export const cpuIoPhase = (phase: Phase) =>
  ({ queued: 'Chờ worker', first: 'Chờ CPU', io: 'Chờ I/O', last: 'Chờ CPU', done: 'Xong' })[phase];
export function normalizeCpuIo(input: Record<string, unknown>): CpuIoConfig {
  return { mode: input['mode'] === 'cpu' ? 'cpu' : 'io', workers: input['workers'] === 2 ? 2 : 1 };
}
/** One CPU, blocking worker slots, independent fixed-duration IO, deterministic A-first scheduler. */
export function simulateCpuIo(input: Record<string, unknown>) {
  const config = normalizeCpuIo(input);
  const steps =
    Number.isInteger(input['step']) && Number(input['step']) >= 0 && Number(input['step']) <= 10
      ? Number(input['step'])
      : 0;
  const burst = config.mode === 'io' ? 1 : 2;
  const jobs: Job[] = [
    { id: 'A', phase: 'queued', remaining: 0, doneAt: null },
    { id: 'B', phase: 'queued', remaining: 0, doneAt: null },
  ];
  function admit() {
    let holding = jobs.filter((j) => j.phase !== 'queued' && j.phase !== 'done').length;
    for (const job of jobs)
      if (job.phase === 'queued' && holding < config.workers) {
        job.phase = 'first';
        job.remaining = burst;
        holding++;
      }
  }
  admit();
  let time = 0,
    busy = 0;
  const timeline: {
    start: number;
    end: number;
    cpu: 'A' | 'B' | null;
    states: { id: 'A' | 'B'; text: string }[];
  }[] = [];
  while (time < steps && jobs.some((j) => j.phase !== 'done')) {
    const ioAtStart = jobs.filter((j) => j.phase === 'io');
    const running = jobs.find((j) => j.phase === 'first' || j.phase === 'last');
    timeline.push({
      start: time,
      end: time + 1,
      cpu: running?.id ?? null,
      states: jobs.map((j) => ({
        id: j.id,
        text: j === running ? 'CPU xử lý' : cpuIoPhase(j.phase),
      })),
    });
    for (const job of ioAtStart) {
      job.remaining--;
      if (job.remaining === 0) {
        job.phase = 'last';
        job.remaining = burst;
      }
    }
    if (running) {
      busy++;
      running.remaining--;
      if (running.remaining === 0) {
        if (running.phase === 'first') {
          running.phase = config.mode === 'io' ? 'io' : 'last';
          running.remaining = config.mode === 'io' ? 3 : burst;
        } else {
          running.phase = 'done';
          running.doneAt = time + 1;
        }
      }
    }
    time++;
    admit();
  }
  return {
    config,
    time,
    busy,
    idle: time - busy,
    jobs,
    timeline,
    done: jobs.filter((j) => j.phase === 'done').length,
    finished: jobs.every((j) => j.phase === 'done'),
  };
}
export function restoreCpuIo(input: Record<string, unknown>) {
  const config = normalizeCpuIo(input);
  return simulateCpuIo({
    ...config,
    step: input['modelVersion'] === CPU_IO_MODEL_VERSION ? input['step'] : 0,
  });
}
export function observeCpuIo(
  before: ReturnType<typeof simulateCpuIo>,
  after: ReturnType<typeof simulateCpuIo>,
): Observation {
  const last = after.timeline.at(-1);
  return {
    schemaVersion: 1,
    action: after.time - before.time === 1 ? 'Qua 1 ms mô phỏng' : 'Chạy đến khi hai việc xong',
    rows: [
      { label: 'Mốc thời gian', before: `${before.time} ms`, after: `${after.time} ms` },
      { label: 'Việc hoàn tất', before: `${before.done}/2`, after: `${after.done}/2` },
      { label: 'CPU đã xử lý', before: `${before.busy} ms`, after: `${after.busy} ms` },
      {
        label: 'Việc đang chờ I/O',
        before: String(before.jobs.filter((j) => j.phase === 'io').length),
        after: String(after.jobs.filter((j) => j.phase === 'io').length),
      },
    ],
    reason:
      after.time - before.time === 1
        ? `Khoảng ${last!.start}–${last!.end} ms: ${last!.cpu ? `CPU xử lý ${last!.cpu}` : 'CPU nghỉ vì chưa có việc sẵn sàng'}. ${after.jobs.map((j) => `${j.id}: ${cpuIoPhase(j.phase)}`).join('; ')} tại mốc ${after.time} ms. Chờ I/O vẫn giữ worker nhưng không giữ CPU.`
        : `Hai việc xong tại ${after.time} ms; CPU bận ${after.busy} ms, nghỉ ${after.idle} ms. Đây là kết quả của cấu hình và giả định trong bài, không phải tốc độ máy thật.`,
  };
}
