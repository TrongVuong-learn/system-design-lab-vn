export const OS_MODEL_VERSION = 1;
function stepOf(input: Record<string, unknown>, max: number) {
  return input.modelVersion === OS_MODEL_VERSION &&
    typeof input.step === 'number' &&
    Number.isInteger(input.step) &&
    input.step >= 0 &&
    input.step <= max
    ? input.step
    : 0;
}
export function addressSpace(input: Record<string, unknown>) {
  const process = input.process === 'B' ? 'B' : 'A';
  const base = process === 'A' ? 4 : 8;
  const address = input.address === 3 || input.address === 4 ? input.address : 0;
  const operation = input.operation === 'write' ? 'write' : 'read';
  const step = stepOf(input, 1);
  const ram = [
    'OS',
    'OS',
    'OS',
    'OS',
    'A0',
    'A1',
    'A2',
    'A3',
    'B0',
    'B1',
    'B2',
    'B3',
    '—',
    '—',
    '—',
    '—',
  ];
  const allowed = address < 4;
  const physical = allowed ? base + address : null;
  const before = physical === null ? null : ram[physical]!;
  if (step && allowed && operation === 'write') ram[physical!] = `${process} mới`;
  return {
    config: { process, address, operation },
    base,
    limit: 4,
    step,
    ram,
    allowed,
    physical,
    before,
    result: step ? (allowed ? ram[physical!]! : 'Bị chặn: vượt giới hạn') : null,
  };
}
export function fileHandles(input: Record<string, unknown>) {
  const step = stepOf(input, 4);
  return {
    step,
    pathExists: step < 2,
    descriptorOpen: step >= 1 && step < 4,
    fileAllocated: step < 4,
    readResult: step === 3 ? 'Lịch: phòng 205' : null,
    events: [
      'Mở /lop/lich.txt → nhận fd 3',
      'Xóa tên /lop/lich.txt (unlink)',
      'Đọc qua fd 3 vẫn thấy: Lịch: phòng 205',
      'Đóng fd 3 → giải phóng file không còn liên kết',
    ].slice(0, step),
  };
}
export function ioLoop(input: Record<string, unknown>) {
  const mode = input.mode === 'blocking' ? 'blocking' : 'nonblocking';
  const end = mode === 'blocking' ? 6 : 5;
  const step = stepOf(input, end);
  // Two jobs arrive at t=0. A needs CPU1, external I/O3, CPU1; B needs CPU1.
  // Blocking stalls this sole event-loop thread; the device works independently.
  const cpu =
    mode === 'blocking'
      ? ['A gửi I/O', 'Chờ I/O', 'Chờ I/O', 'Chờ I/O', 'A xử lý kết quả', 'B xử lý']
      : ['A gửi I/O', 'B xử lý', 'Chờ sự kiện', 'Chờ sự kiện', 'A xử lý kết quả'];
  const time = step;
  const bDone = time >= (mode === 'blocking' ? 6 : 2);
  return {
    config: { mode },
    step: time,
    end,
    timeline: cpu.slice(0, time),
    aDone: time >= 5,
    bDone,
    ioPending: time >= 1 && time < 4,
    ready: time >= 4 && time < 5,
    finished: time === end,
  };
}
