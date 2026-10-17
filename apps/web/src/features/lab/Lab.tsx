import { PriorityHeapLab } from './PriorityHeapLab';
import { SearchTreeLab } from './SearchTreeLab';
import { HashTableLab } from './HashTableLab';
import { LibrarySearchLab } from './LibrarySearchLab';
import { ObservationPanel } from './ObservationPanel';
import { CpuIoLab } from './CpuIoLab';
import { ConcurrencyLab } from './ConcurrencyLab';
import { TlsLab } from './TlsLab';
import { RoutingLab } from './RoutingLab';
import { HttpLab, NetworkLab } from './NetworkLabs';
import { MetricsLab, DnsLab, TransportLab, CapacityLab } from './FoundationLabs';
import type { Lesson, LessonProgress } from '@sdl/content-schema';
import {
  cacheStep,
  observeRemaining,
  type GuidedKind,
  observeCache,
  observeQueue,
  initialCache,
  restoreCache,
  boundedNumber,
  trafficStep,
  initialQueue,
  restoreQueue,
  restoreReplica,
  queueStep,
  initialReplica,
  replicaTick,
  replicaWrite,
  type CacheCommand,
} from '@sdl/simulation-engine';
import { Diagram, Icon, Metric, Stepper } from '../../ui/primitives';

type LabProps = {
  lesson: Lesson;
  progress: LessonProgress;
  onChange(patch: Partial<LessonProgress>): void;
};
export function Lab(original: LabProps) {
  const kind = original.lesson.kind;
  const extended = ![
    'cache',
    'queue',
    'network',
    'tls',
    'concurrency',
    'cpu-io',
    'library-search',
    'hash-table',
    'search-tree',
    'priority-heap',
  ].includes(kind);
  const props = extended
    ? {
        ...original,
        onChange(patch: Partial<LessonProgress>) {
          if (!patch.lab) {
            original.onChange(patch);
            return;
          }
          const observation =
            patch.lab['observation'] === null
              ? null
              : observeRemaining(kind as GuidedKind, original.progress.lab, patch.lab);
          original.onChange({
            ...patch,
            lab: { ...patch.lab, observation: observation ? JSON.stringify(observation) : '' },
          });
        },
      }
    : original;
  switch (props.lesson.kind) {
    case 'cache':
      return <CacheLab {...props} />;
    case 'queue':
      return <QueueLab {...props} />;
    case 'replica':
      return <ReplicaLab {...props} />;
    case 'balance':
      return <TrafficLab {...props} />;
    case 'design':
      return <TrafficLab {...props} design />;
    case 'metrics':
      return <MetricsLab {...props} />;
    case 'dns':
      return <DnsLab {...props} />;
    case 'transport':
      return <TransportLab {...props} />;
    case 'capacity':
      return <CapacityLab {...props} />;
    case 'http':
      return <HttpLab {...props} />;
    case 'priority-heap':
      return <PriorityHeapLab {...props} />;
    case 'search-tree':
      return <SearchTreeLab {...props} />;
    case 'hash-table':
      return <HashTableLab {...props} />;
    case 'library-search':
      return <LibrarySearchLab {...props} />;
    case 'cpu-io':
      return <CpuIoLab {...props} />;
    case 'concurrency':
      return <ConcurrencyLab {...props} />;
    case 'tls':
      return <TlsLab {...props} />;
    case 'routing':
      return <RoutingLab {...props} />;
    case 'network':
      return <NetworkLab {...props} />;
    case 'request':
      return <RequestLab {...props} />;
  }
}
function CacheLab({ progress, onChange }: LabProps) {
  const state = restoreCache(progress.lab);
  function act(command: CacheCommand) {
    const next = cacheStep(state, command);
    onChange({
      lab: { ...next, observation: JSON.stringify(observeCache(state, next, command)) },
      actions: progress.actions + 1,
    });
  }
  const expired = state.time - state.refreshedAt >= state.ttl;
  return (
    <section className="lab-panel" aria-label="Thí nghiệm cache">
      <div className="lab-head">
        <span className="eyebrow">Thí nghiệm cache</span>
        <span className="time-badge">Phút {state.time} mô phỏng</span>
      </div>
      <Diagram
        labels={['Bạn xem lịch', 'Bản ghi gần (cache)', 'Nơi lưu lịch chính']}
        values={[
          '',
          `Phòng ${state.cached} · ${expired ? 'hết hạn' : 'còn hạn'}`,
          `Phòng ${state.source}`,
        ]}
        active={state.last === null ? -1 : 1}
      />
      <div className="lab-controls">
        <button className="button primary" onClick={() => act({ type: 'read' })}>
          Xem lịch
        </button>
        <button
          className="button secondary"
          onClick={() => act({ type: 'update', value: state.source === 201 ? 205 : 201 })}
        >
          Đổi phòng ở nguồn
        </button>
        <button className="button secondary" onClick={() => act({ type: 'refresh' })}>
          Lấy lịch mới
        </button>
        <button className="button secondary" onClick={() => act({ type: 'wait' })}>
          Qua 1 phút
        </button>
      </div>
      <ObservationPanel value={progress.lab['observation']} />
      {!progress.lab['observation'] && (
        <div className="feedback" role="status">
          <p>{state.message}</p>
        </div>
      )}
      <div className="metrics">
        <Metric label="Lượt xem" value={state.reads} />
        <Metric label="Xem qua cache" value={state.hits} />
        <Metric label="Xem qua nguồn" value={state.misses} />
        <Metric label="Lượt thấy dữ liệu cũ" value={state.stale} />
      </div>
      <p className="muted">
        Các số trên chỉ đếm lượt bấm “Xem lịch”. “Lấy lịch mới” cũng đọc nguồn nhưng không tính là
        một lượt xem.
      </p>
      <details className="advanced">
        <summary>Thử thêm: thay thời hạn bản ghi</summary>
        <Stepper
          label="Thời hạn bản ghi"
          unit="phút kể từ lần lấy mới"
          value={state.ttl}
          min={1}
          max={10}
          onChange={(value) => act({ type: 'ttl', value })}
        />
      </details>
      <button
        className="text-button"
        onClick={() => onChange({ lab: { ...initialCache() }, actions: progress.actions + 1 })}
      >
        <Icon name="reset" size={16} />
        Đặt lại thí nghiệm
      </button>
    </section>
  );
}
function RequestLab({ progress, onChange }: LabProps) {
  const step = boundedNumber(progress.lab['step'], 0, 0, 3);
  const delay = boundedNumber(progress.lab['delay'], 80, 20, 200);
  const times = [20, delay, 20];
  return (
    <section className="lab-panel">
      <span className="eyebrow">Theo dấu một yêu cầu</span>
      <Diagram
        labels={['Thiết bị gửi yêu cầu', 'Máy xử lý hỏi nơi lưu lịch', 'Câu trả lời về thiết bị']}
        values={times.map((t) => `${t} ms`)}
        active={step - 1}
      />
      <div className="feedback" role="status">
        <p>
          {step === 0
            ? 'Bấm Từng bước để theo dấu lần xem lịch.'
            : step === 3
              ? `Đã nhận lịch. Tổng thời gian: ${20 + delay + 20} ms.`
              : `Đã qua chặng ${step}. Yêu cầu đang tiếp tục đi.`}
        </p>
      </div>
      <Stepper
        label="Thời gian tra lịch"
        unit="mili giây (ms) giả lập"
        value={delay}
        min={20}
        max={200}
        step={20}
        onChange={(value) =>
          onChange({ lab: { step: 0, delay: value }, actions: progress.actions + 1 })
        }
      />
      <p className="muted">Mỗi mức bằng 20 ms. Hiện tại: {delay} ms.</p>
      <div className="lab-controls">
        <button
          className="button primary"
          disabled={step === 3}
          onClick={() =>
            onChange({ lab: { step: step + 1, delay }, actions: progress.actions + 1 })
          }
        >
          Từng bước
        </button>
        <button
          className="button secondary"
          onClick={() => onChange({ lab: { step: 0, delay }, actions: progress.actions + 1 })}
        >
          Gửi lại từ đầu
        </button>
      </div>
      <ObservationPanel value={progress.lab['observation']} />
    </section>
  );
}
function TrafficLab({ progress, onChange, design = false }: LabProps & { design?: boolean }) {
  const servers = boundedNumber(progress.lab['servers'], 1, 1, 4);
  const arrivals = design ? 12 : boundedNumber(progress.lab['arrivals'], 8, 1, 20);
  const cache = Boolean(progress.lab['cache'] ?? false);
  const workers = boundedNumber(progress.lab['workers'], 1, 1, 5);
  const result = trafficStep({
    arrivals,
    servers,
    serverCapacity: 6,
    databaseCapacity: 4,
    cacheHit: cache ? 0.75 : 0,
  });
  const cost = servers + workers + (cache ? 1 : 0);
  const passed = result.waiting === 0 && workers * 2 >= 6 && cost <= 6;
  function change(p: LessonProgress['lab']) {
    onChange({ lab: { ...progress.lab, ...p }, actions: progress.actions + 1 });
  }
  return (
    <section className="lab-panel">
      <span className="eyebrow">{design ? 'Ngân sách: 6 điểm giả lập' : 'Một giây mô phỏng'}</span>
      <Diagram
        labels={['Yêu cầu mới', 'Máy xử lý', 'Nơi lưu lịch']}
        values={[`${arrivals} lượt/giây`, `${servers} máy × 6 lượt/giây`, '4 lượt đọc/giây']}
      />
      <Stepper
        label="Số máy xử lý"
        unit="mỗi máy làm 6 yêu cầu/giây"
        value={servers}
        min={1}
        max={4}
        onChange={(value) => change({ servers: value })}
      />
      {!design && (
        <Stepper
          label="Yêu cầu đến mỗi giây"
          value={arrivals}
          min={1}
          max={20}
          onChange={(value) => change({ arrivals: value })}
        />
      )}
      <label className="toggle">
        <input
          type="checkbox"
          checked={cache}
          onChange={(e) => change({ cache: e.target.checked })}
        />
        <span>
          Thêm cache <small>Hit rate trung bình giả định 75%</small>
        </span>
      </label>
      {design && (
        <Stepper
          label="Worker gửi thông báo"
          unit="mỗi worker làm 2 việc/giây"
          value={workers}
          min={1}
          max={5}
          onChange={(value) => change({ workers: value })}
        />
      )}
      <ObservationPanel value={progress.lab['observation']} />
      <div className="metrics">
        <Metric label="Lượt đọc hoàn tất" value={result.completed} suffix=" / giây" />
        <Metric label="Lượt đọc còn chờ" value={result.waiting} suffix=" lượt" />
        {design && (
          <>
            <Metric label="Công suất gửi thông báo" value={workers * 2} suffix=" / giây" />
            <Metric label="Chi phí giả lập" value={cost} suffix=" / 6" />
          </>
        )}
      </div>
      <div className={`feedback ${design && passed ? 'success' : ''}`} role="status">
        <p>
          {design
            ? passed
              ? 'Đạt tải đọc, tải gửi và ngân sách trong mô hình này. Tiếp theo hãy nghĩ đến dữ liệu cũ và khi một máy lỗi.'
              : 'Hãy đáp ứng 12 lượt đọc/giây, 6 việc gửi/giây và chi phí không quá 6 điểm.'
            : result.waiting
              ? `Có ${result.waiting} lượt chưa được làm xong trong giây này. Giới hạn hiện ở ${result.bottleneck}.`
              : 'Đủ công suất cho tải đang chọn trong mô hình. Thử tăng tải để tìm giới hạn tiếp theo.'}
        </p>
      </div>
      <p className="muted">
        Đây là cửa sổ 1 giây bắt đầu không có backlog. “Còn chờ” không phải tổng hàng đợi của một
        lần chạy kéo dài. Khi bật cache, tỷ lệ hit trung bình giả định là 75%. Ví dụ, 2 lượt hoàn
        tất tương ứng 0,5 lượt đọc nguồn kỳ vọng mỗi giây. Số lẻ biểu diễn tốc độ trung bình, không
        phải một phần yêu cầu được gửi; bài chưa mô phỏng hit/miss của từng lượt.
      </p>
    </section>
  );
}
function QueueLab({ progress, onChange }: LabProps) {
  const arrivals = boundedNumber(progress.lab['arrivals'], 6, 0, 12);
  const workers = boundedNumber(progress.lab['workers'], 1, 1, 6);
  const state = restoreQueue({
    second: progress.lab['second'] ?? 0,
    received: progress.lab['received'] ?? 0,
    processed: progress.lab['processed'] ?? 0,
    queued: progress.lab['queued'] ?? 0,
  });
  function change(p: LessonProgress['lab']) {
    const next = restoreQueue({ ...state, ...p });
    const observation =
      p['observation'] === ''
        ? ''
        : JSON.stringify(
            observeQueue(
              state,
              next,
              Number(p['arrivals'] ?? arrivals),
              Number(p['workers'] ?? workers),
              arrivals,
              workers,
            ),
          );
    onChange({ lab: { ...progress.lab, ...p, observation }, actions: progress.actions + 1 });
  }
  return (
    <section className="lab-panel">
      <span className="eyebrow">Giây mô phỏng {state.second}</span>
      <Diagram
        labels={['Việc mới mỗi giây', 'Hàng đợi', 'Workers']}
        values={[arrivals, `${state.queued} việc chờ`, `${workers} người × 2 việc/giây`]}
      />
      <Stepper
        label="Việc đến mỗi giây"
        value={arrivals}
        min={0}
        max={12}
        onChange={(value) => change({ arrivals: value })}
      />
      <Stepper
        label="Số worker"
        value={workers}
        min={1}
        max={6}
        onChange={(value) => change({ workers: value })}
      />
      <div className="lab-controls">
        <button
          className="button primary"
          onClick={() => {
            change({ ...queueStep(state, arrivals, workers) });
          }}
        >
          Qua 1 giây
        </button>
        <button
          className="button secondary"
          onClick={() => {
            change({ ...initialQueue(), observation: '' });
          }}
        >
          Đặt lại hàng đợi
        </button>
      </div>
      <div className="metrics">
        <Metric label="Đã nhận" value={state.received} />
        <Metric label="Đã làm xong" value={state.processed} />
        <Metric label="Đang chờ" value={state.queued} />
      </div>
      <ObservationPanel value={progress.lab['observation']} />
      {!progress.lab['observation'] && (
        <div className="feedback" role="status">
          <p>Từng lần bấm là một giây mô phỏng. Hãy thử 3 bước với một worker, rồi tăng worker.</p>
        </div>
      )}
      <p className="muted">
        Trong bài, việc đến và tốc độ xử lý đều cố định. Thực tế có lúc việc dồn đến hoặc xử lý chậm
        hơn; cần công suất dự phòng, không chỉ cân bằng hai con số trung bình.
      </p>
    </section>
  );
}
function ReplicaLab({ progress, onChange }: LabProps) {
  const lag = boundedNumber(progress.lab['lag'], 3, 0, 5);
  let pending: unknown;
  try {
    pending = JSON.parse(String(progress.lab['pending'] ?? '[]'));
  } catch {
    pending = null;
  }
  const state = restoreReplica({
    time: progress.lab['time'] ?? 0,
    primary: progress.lab['primary'] ?? 201,
    replica: progress.lab['replica'] ?? 201,
    pending,
  });
  function change(s: typeof state, reset = false) {
    onChange({
      lab: {
        time: s.time,
        primary: s.primary,
        replica: s.replica,
        pending: JSON.stringify(s.pending),
        observation: reset ? null : '',
        lag,
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel">
      <span className="eyebrow">Giây mô phỏng {state.time}</span>
      <Diagram
        labels={['Nguồn chính', 'Bản sao']}
        values={[`Phòng ${state.primary}`, `Phòng ${state.replica}`]}
      />
      <Stepper
        label="Độ trễ sao chép"
        unit="giây; áp dụng cho lần ghi tiếp theo"
        value={lag}
        min={0}
        max={5}
        onChange={(value) =>
          onChange({ lab: { ...progress.lab, lag: value }, actions: progress.actions + 1 })
        }
      />
      <div className="lab-controls">
        <button
          className="button primary"
          disabled={state.pending.length >= 10}
          onClick={() => change(replicaWrite(state, state.primary === 201 ? 205 : 201, lag))}
        >
          Đổi phòng ở nguồn
        </button>
        <button className="button secondary" onClick={() => change(replicaTick(state))}>
          Qua 1 giây
        </button>
        <button className="button secondary" onClick={() => change(initialReplica(), true)}>
          Đặt lại
        </button>
      </div>
      <ObservationPanel value={progress.lab['observation']} />
      <div className="feedback" role="status">
        <p>
          {state.primary === state.replica
            ? 'Hai nơi đang trả lời cùng phòng. Đổi nguồn rồi quan sát bản sao.'
            : `Nguồn chính ghi ${state.primary}, bản sao vẫn trả ${state.replica}. Có ${state.pending.length} thay đổi đang trên đường đến bản sao.`}
        </p>
      </div>
      <p className="muted">
        Đọc ngay sau ghi: nguồn trả {state.primary}, bản sao trả {state.replica}.
      </p>
      <p className="muted">
        Khi giảm độ trễ, thay đổi mới vẫn chờ thay đổi trước để giữ thứ tự. Riêng mức 0 là chế độ lý
        tưởng: lần ghi tiếp theo đưa bản sao về giá trị mới nhất và bỏ các thay đổi còn chờ. Đây
        không phải mô phỏng giao thức sao chép đồng bộ.
      </p>
    </section>
  );
}
