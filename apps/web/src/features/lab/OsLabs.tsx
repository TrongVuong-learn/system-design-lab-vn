import type { LessonProgress } from '@sdl/content-schema';
import { addressSpace, fileHandles, ioLoop, OS_MODEL_VERSION } from '@sdl/simulation-engine';
import { ObservationPanel } from './ObservationPanel';
type Props = { progress: LessonProgress; onChange(patch: Partial<LessonProgress>): void };
function observation(action: string, label: string, before: string, after: string, reason: string) {
  return JSON.stringify({ schemaVersion: 1, action, rows: [{ label, before, after }], reason });
}
export function AddressSpaceLab({ progress, onChange }: Props) {
  const s = addressSpace(progress.lab);
  function configure(patch: Record<string, string | number> = {}) {
    onChange({
      lab: { ...s.config, ...patch, step: 0, modelVersion: OS_MODEL_VERSION, observation: '' },
      actions: progress.actions + 1,
    });
  }
  function run() {
    const next = addressSpace({ ...s.config, step: 1, modelVersion: OS_MODEL_VERSION });
    onChange({
      lab: {
        ...s.config,
        step: 1,
        modelVersion: OS_MODEL_VERSION,
        observation: observation(
          'Thử truy cập',
          'Kết quả',
          'Chưa truy cập',
          next.result!,
          next.allowed
            ? 'Kiểm tra 0 ≤ địa chỉ ảo < 4, rồi cộng base của process.'
            : 'Địa chỉ bằng giới hạn không hợp lệ; chặn trước khi đọc hoặc ghi RAM.',
        ),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm không gian địa chỉ">
      <h2>Cùng địa chỉ 0, có cùng dữ liệu không?</h2>
      <div className="routing-inputs">
        <label>
          Process
          <select
            aria-label="Process"
            value={s.config.process}
            onChange={(e) => configure({ process: e.target.value })}
          >
            <option>A</option>
            <option>B</option>
          </select>
        </label>
        <label>
          Địa chỉ ảo
          <select
            aria-label="Địa chỉ ảo"
            value={s.config.address}
            onChange={(e) => configure({ address: Number(e.target.value) })}
          >
            <option value="0">0 — hợp lệ</option>
            <option value="3">3 — hợp lệ cuối vùng</option>
            <option value="4">4 — ngoài vùng</option>
          </select>
        </label>
        <label>
          Thao tác
          <select
            aria-label="Thao tác"
            value={s.config.operation}
            onChange={(e) => configure({ operation: e.target.value })}
          >
            <option value="read">Đọc</option>
            <option value="write">Ghi giá trị mới của process</option>
          </select>
        </label>
      </div>
      <p>
        Process {s.config.process}: base {s.base}, giới hạn 4 ô. Đổi lựa chọn bắt đầu lượt mới với
        RAM ban đầu; không giữ lần ghi trước.
      </p>
      <div className="lab-controls">
        <button className="button primary" disabled={s.step === 1} onClick={run}>
          Thử truy cập
        </button>
        <button className="button secondary" onClick={() => configure()}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        {s.step
          ? s.allowed
            ? `VA ${s.config.address} → PA ${s.physical}. Kết quả: ${s.result}.`
            : 'Bị chặn: vượt giới hạn. RAM không đổi.'
          : 'Chưa truy cập RAM.'}
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      <h3>RAM vật lý: 16 ô</h3>
      <ol role="list" className="os-memory">
        {s.ram.map((value, i) => (
          <li key={i} className={s.step && s.physical === i ? 'resident' : ''}>
            <strong>PA {i}</strong>
            <span>{value}</span>
          </li>
        ))}
      </ol>
      <p className="muted">
        OS đặt base/limit; chương trình không tự sửa chúng. Mô hình base-and-bounds với vùng liên
        tục, không phải paging hiện đại. Không TLB, swap, shared memory, COW hoặc đo tốc độ; ô là
        đơn vị giả định, không byte thực. Không gian riêng không có nghĩa mọi lỗi OS đều bị ngăn.
      </p>
    </section>
  );
}
export function FileHandlesLab({ progress, onChange }: Props) {
  const s = fileHandles(progress.lab);
  const labels = ['Mở file', 'Xóa tên file', 'Đọc qua fd 3', 'Đóng fd 3'];
  function run(step: number) {
    const next = fileHandles({ step, modelVersion: OS_MODEL_VERSION });
    onChange({
      lab: {
        step,
        modelVersion: OS_MODEL_VERSION,
        observation: step
          ? observation(
              labels[s.step] ?? 'Tiến bước',
              'Tên đường dẫn',
              s.pathExists ? 'Có tên' : 'Không còn tên',
              next.pathExists ? 'Có tên' : 'Không còn tên',
              next.events.at(-1)!,
            )
          : '',
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm file và đường dẫn">
      <h2>Xóa tên file có đóng file đang mở không?</h2>
      <p>
        Mô hình Unix/POSIX: một file, một tên /lop/lich.txt và tối đa một descriptor fd 3. Dữ liệu
        dựng sẵn: “Lịch: phòng 205”.
      </p>
      <div className="lab-controls">
        <button className="button primary" disabled={s.step === 4} onClick={() => run(s.step + 1)}>
          {labels[s.step] ?? 'Đã đóng file'}
        </button>
        <button className="button secondary" onClick={() => run(0)}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        Bước {s.step}/4. Đường dẫn: {s.pathExists ? 'còn tên' : 'đã xóa tên'}. Descriptor:{' '}
        {s.descriptorOpen ? 'đang mở' : 'đóng'}. File:{' '}
        {s.fileAllocated ? 'còn được giữ' : 'được giải phóng'}.
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      <dl className="representation-record">
        <dt>Tên trong thư mục</dt>
        <dd>{s.pathExists ? '/lop/lich.txt' : 'Không còn'}</dd>
        <dt>Handle của process</dt>
        <dd>{s.descriptorOpen ? 'fd 3 → file' : 'Không có'}</dd>
        <dt>Dữ liệu của file</dt>
        <dd>{s.fileAllocated ? 'Lịch: phòng 205' : 'Đã giải phóng'}</dd>
      </dl>
      {s.readResult && (
        <p>
          <strong>Đọc qua fd 3: {s.readResult}.</strong>
        </p>
      )}
      <ol>
        {s.events.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ol>
      <p className="muted">
        Sau unlink, mở lại bằng tên cũ sẽ không tìm thấy; descriptor đã mở vẫn dùng được. File chỉ
        được giải phóng khi không còn tên liên kết và handle mở trong ví dụ. Đây không phải thao tác
        xóa file thật. Không nhiều hard link, quyền truy cập, symlink, crash, fsync, journal hoặc
        chứng minh xóa an toàn dữ liệu trên đĩa. Chưa mô phỏng filesystem Windows.
      </p>
    </section>
  );
}
export function EventLoopLab({ progress, onChange }: Props) {
  const s = ioLoop(progress.lab);
  function configure(mode: string = s.config.mode) {
    onChange({
      lab: { mode, step: 0, modelVersion: OS_MODEL_VERSION, observation: '' },
      actions: progress.actions + 1,
    });
  }
  function run() {
    const step = s.step + 1;
    const next = ioLoop({ ...s.config, step, modelVersion: OS_MODEL_VERSION });
    onChange({
      lab: {
        ...s.config,
        step,
        modelVersion: OS_MODEL_VERSION,
        observation: observation(
          'Qua một khoảng',
          'Việc B',
          s.bDone ? 'Xong' : 'Chưa xong',
          next.bDone ? 'Xong' : 'Chưa xong',
          next.timeline.at(-1)!,
        ),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm event loop">
      <h2>Trong lúc A chờ dữ liệu, B có được làm không?</h2>
      <div className="routing-inputs">
        <label>
          Cách chờ I/O
          <select value={s.config.mode} onChange={(e) => configure(e.target.value)}>
            <option value="nonblocking">Non-blocking: nhường vòng lặp</option>
            <option value="blocking">Blocking: giữ luồng chờ</option>
          </select>
        </label>
      </div>
      <p>
        Một luồng event loop, một CPU. A và B cùng tới mốc 0. A cần CPU 1 khoảng → thiết bị I/O 3
        khoảng → CPU 1 khoảng; B chỉ cần CPU 1 khoảng. Đổi chế độ bắt đầu lại.
      </p>
      <div className="lab-controls">
        <button className="button primary" disabled={s.finished} onClick={run}>
          Qua một khoảng
        </button>
        <button className="button secondary" onClick={() => configure()}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        Mốc {s.step}. A: {s.aDone ? 'xong' : 'chưa xong'}. B: {s.bDone ? 'xong' : 'chưa xong'}.{' '}
        {s.ioPending
          ? 'Thiết bị đang xử lý I/O.'
          : s.ready
            ? 'Kết quả I/O sẵn sàng, phần xử lý tiếp của A chưa chạy.'
            : ''}
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      <ol>
        {s.timeline.map((event, i) => (
          <li key={i}>
            Khoảng [{i}, {i + 1}): {event}.
          </li>
        ))}
      </ol>
      <p className="muted">
        Non-blocking không làm I/O của A nhanh hơn: A vẫn xong mốc 5; B xong mốc 2 thay vì 6. Thiết
        bị xử lý I/O ngoài luồng vòng lặp. Callback vẫn chạy lần lượt; CPU nặng vẫn có thể chặn vòng
        lặp. Khoảng thời gian giả định, không benchmark Node.js, không mô phỏng
        phase/timer/microtask, thread pool hoặc API hệ điều hành thật.
      </p>
    </section>
  );
}
