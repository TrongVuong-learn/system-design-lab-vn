import type { LessonProgress } from '@sdl/content-schema';
import {
  serializeRecord,
  compressRuns,
  REPRESENTATION_MODEL_VERSION,
} from '@sdl/simulation-engine';
import { ObservationPanel } from './ObservationPanel';
type Props = { progress: LessonProgress; onChange(patch: Partial<LessonProgress>): void };
export function SerializationLab({ progress, onChange }: Props) {
  const state = serializeRecord(progress.lab);
  function configure(sample: string = state.config.sample, pretty = state.config.pretty) {
    onChange({
      lab: { sample, pretty, step: 0, modelVersion: REPRESENTATION_MODEL_VERSION, observation: '' },
      actions: progress.actions + 1,
    });
  }
  function run() {
    const step = state.step + 1;
    onChange({
      lab: {
        ...state.config,
        step,
        modelVersion: REPRESENTATION_MODEL_VERSION,
        observation: JSON.stringify({
          schemaVersion: 1,
          action: step === 1 ? 'Tạo JSON UTF-8' : 'Đọc lại JSON',
          rows: [
            {
              label: 'Chặng',
              before: step === 1 ? 'Bản ghi' : 'JSON UTF-8',
              after: step === 1 ? 'JSON UTF-8' : 'Bản ghi khôi phục',
            },
          ],
          reason:
            step === 1
              ? 'JSON biểu diễn tên trường, giá trị và kiểu dữ liệu. UTF-8 biến văn bản thành byte để lưu hoặc gửi.'
              : 'Bộ đọc JSON dựng lại bản ghi từ các byte; không thực thi văn bản như mã chương trình.',
        }),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm serialization">
      <h2>Đóng gói một bản ghi để gửi</h2>
      <div className="routing-inputs">
        <label>
          Tên trong bản ghi
          <select value={state.config.sample} onChange={(e) => configure(e.target.value)}>
            <option value="ascii">An</option>
            <option value="vietnamese">Bình</option>
            <option value="quoted">An, "B"</option>
          </select>
        </label>
        <label>
          Cách viết JSON
          <select
            value={String(state.config.pretty)}
            onChange={(e) => configure(state.config.sample, e.target.value === 'true')}
          >
            <option value="false">Gọn, không thụt dòng</option>
            <option value="true">Thụt dòng để dễ đọc</option>
          </select>
        </label>
      </div>
      <p>
        Đổi lựa chọn bắt đầu lại. Cùng các trường và giá trị; khoảng trắng định dạng có thể đổi số
        byte mà không đổi bản ghi.
      </p>
      <dl className="representation-record">
        <dt>Tên (chuỗi)</dt>
        <dd>{state.record.name}</dd>
        <dt>Số chỗ (số)</dt>
        <dd>{state.record.seats}</dd>
        <dt>Đã xác nhận (boolean)</dt>
        <dd>true</dd>
      </dl>
      <div className="lab-controls">
        <button className="button primary" disabled={state.finished} onClick={run}>
          {state.step === 0 ? 'Tạo JSON UTF-8' : state.step === 1 ? 'Đọc lại JSON' : 'Đã khôi phục'}
        </button>
        <button className="button secondary" onClick={() => configure()}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        {state.step === 0
          ? 'Chưa tạo JSON.'
          : `JSON UTF-8: ${state.byteLength} byte. ${state.finished ? 'Đã khôi phục đúng bản ghi.' : 'Chưa đọc lại.'}`}
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      {state.step > 0 && (
        <>
          <h3>Văn bản JSON</h3>
          <pre className="representation-wire">{state.text}</pre>
          <details>
            <summary>Xem các byte thập phân</summary>
            <p className="representation-wire">{state.bytes.join(' ')}</p>
          </details>
        </>
      )}
      {state.decoded && (
        <p>
          Tên khôi phục: <strong>{state.decoded.name}</strong>. Số chỗ vẫn là số 2, confirmed vẫn là
          boolean true.
        </p>
      )}
      <p className="muted">
        Chỉ ba bản ghi dựng sẵn, số nguyên nhỏ, chuỗi Unicode và boolean; không Date, số lớn, binary
        hoặc schema evolution. JSON không tự xác nhận quy tắc nghiệp vụ. Không nén, mã hóa bảo mật,
        gửi mạng hay đo tốc độ. Số byte là UTF-8, không phải số ký tự nhìn thấy.
      </p>
    </section>
  );
}
export function CompressionLab({ progress, onChange }: Props) {
  const state = compressRuns(progress.lab);
  function configure(pattern: string = state.config.pattern) {
    onChange({
      lab: { pattern, step: 0, modelVersion: REPRESENTATION_MODEL_VERSION, observation: '' },
      actions: progress.actions + 1,
    });
  }
  function run() {
    const step = state.step + 1;
    onChange({
      lab: {
        ...state.config,
        step,
        modelVersion: REPRESENTATION_MODEL_VERSION,
        observation: JSON.stringify({
          schemaVersion: 1,
          action: step === 1 ? 'Nén theo dãy lặp' : 'Giải nén',
          rows: [
            {
              label: 'Dữ liệu',
              before: step === 1 ? `${state.rawBytes} byte gốc` : `${state.encodedBytes} byte nén`,
              after:
                step === 1 ? `${state.encodedBytes} byte nén` : `${state.rawBytes} byte khôi phục`,
            },
          ],
          reason:
            step === 1
              ? 'Mỗi dãy ký hiệu liên tiếp được thay bằng hai byte: số lần và mã ASCII. Dãy ngắn có thể làm dữ liệu lớn hơn.'
              : 'Đọc từng cặp byte và lặp lại ký hiệu đúng số lần; kết quả giống hệt chuỗi gốc.',
        }),
      },
      actions: progress.actions + 1,
    });
  }
  return (
    <section className="lab-panel" aria-label="Thí nghiệm compression">
      <h2>Nén có luôn làm dữ liệu nhỏ đi?</h2>
      <div className="routing-inputs">
        <label>
          Mẫu dữ liệu
          <select value={state.config.pattern} onChange={(e) => configure(e.target.value)}>
            <option value="repeated">Tám A rồi tám B</option>
            <option value="alternating">A và B xen kẽ</option>
          </select>
        </label>
      </div>
      <p>Đổi mẫu bắt đầu lại. Cả hai chuỗi có 16 ký hiệu ASCII, mỗi ký hiệu gốc chiếm một byte.</p>
      <p className="representation-wire" aria-label="Chuỗi gốc">
        {state.raw}
      </p>
      <div className="lab-controls">
        <button className="button primary" disabled={state.finished} onClick={run}>
          {state.step === 0 ? 'Nén chuỗi' : state.step === 1 ? 'Giải nén' : 'Đã khôi phục'}
        </button>
        <button className="button secondary" onClick={() => configure()}>
          Bắt đầu lại
        </button>
      </div>
      <p role="status">
        {state.step === 0
          ? 'Gốc: 16 byte. Chưa nén.'
          : `Gốc: ${state.rawBytes} byte. Sau nén: ${state.encodedBytes} byte. ${state.finished ? 'Khôi phục đúng chuỗi gốc.' : 'Chưa giải nén.'}`}
      </p>
      <ObservationPanel value={progress.lab['observation']} />
      {state.step > 0 && (
        <>
          <h3>Các dãy lặp</h3>
          <ol role="list" className="compression-pairs">
            {state.pairs.map((p, i) => (
              <li key={i}>
                <strong>
                  {p.count} × {p.symbol}
                </strong>
                <span>2 byte</span>
              </li>
            ))}
          </ol>
          <details>
            <summary>Xem byte đã nén</summary>
            <p className="representation-wire">{state.encoded.join(' ')}</p>
            <p>
              Cặp 8, 65 nghĩa là lặp ký hiệu ASCII 65 (A) tám lần. Đây là giá trị hai byte, không
              phải kích thước văn bản “8, 65”.
            </p>
          </details>
        </>
      )}
      {state.restored && (
        <>
          <h3>Chuỗi khôi phục</h3>
          <p className="representation-wire">{state.restored}</p>
        </>
      )}
      <p className="muted">
        Định dạng RLE tự đặt: một byte số lần và một byte ký hiệu A/B, không header/checksum. Chỉ
        hai chuỗi cố định, mỗi dãy tối đa 16; không nhận file hay Unicode tùy ý. Đây không phải
        gzip/DEFLATE. Không đo CPU, tốc độ truyền, bảo mật hoặc bảo đảm mọi dữ liệu đều nhỏ hơn.
      </p>
    </section>
  );
}
