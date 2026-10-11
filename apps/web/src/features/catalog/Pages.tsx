import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { lessons, levels, modules, tracks } from '../../app/catalog';
import { useProgress } from '../../app/progress';
import { parseProgress, serializeProgress } from '@sdl/learning-core';
import { Icon } from '../../ui/primitives';

export function LessonCard({ id, index = 0 }: { id: string; index?: number }) {
  const l = lessons.find((l) => l.id === id)!;
  const { progress } = useProgress();
  const done = progress.lessons[id]?.completed;
  return (
    <Link to={`/learn/${id}`} className="lesson-card">
      <div className={`lesson-visual visual-${l.kind}`}>
        <span className="visual-number">{String(index + 1).padStart(2, '0')}</span>
        <div className="mini-system">
          <i />
          <b>→</b>
          <i />
          <b>→</b>
          <i />
        </div>
        <span className="visual-kind">{l.terms[0]?.english}</span>
        {done && (
          <span className="done-badge">
            <Icon name="check" size={14} />
            Đã hoàn thành
          </span>
        )}
      </div>
      <div className="lesson-card-body">
        <div className="lesson-meta">
          <span>{l.level} · Bài nhập môn</span>
          <span>
            <Icon name="clock" size={13} />
            {l.minutes} phút
          </span>
        </div>
        <h3>{l.title}</h3>
        <p>{l.subtitle}</p>
        <span className="card-action">
          {done
            ? 'Ôn lại bài'
            : progress.lessons[id]?.stage
              ? 'Tiếp tục học'
              : 'Bắt đầu thí nghiệm'}
          <Icon name="arrow" size={18} />
        </span>
      </div>
    </Link>
  );
}
export function HomePage() {
  const { progress } = useProgress();
  const continuation = lessons.find(
    (l) => progress.lessons[l.id] && !progress.lessons[l.id]?.completed,
  );
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="live-dot" /> HỌC BẰNG CÁCH THỬ
          </span>
          <h1>
            Hiểu hệ thống.
            <br />
            <em>Thử từng bước.</em>
          </h1>
          <p>
            Đi từ những chuyện quen thuộc đến cách một hệ thống hoạt động. Tự thay đổi, quan sát và
            hiểu vì sao.
          </p>
          <div className="hero-actions">
            <Link
              className="button primary"
              to={continuation ? `/learn/${continuation.id}` : '/learn/request'}
            >
              {continuation ? 'Tiếp tục bài đang học' : 'Bắt đầu từ số 0'}
              <Icon name="arrow" />
            </Link>
            <Link className="text-link" to="/explore">
              Xem lộ trình
            </Link>
          </div>
          <div className="hero-notes">
            <span>
              <Icon name="check" size={15} />
              Không cần biết code
            </span>
            <span>
              <Icon name="check" size={15} />
              Học theo nhịp của bạn
            </span>
          </div>
        </div>
        <div className="hero-illustration" aria-label="Minh họa một yêu cầu đi qua các thành phần">
          <span className="illustration-caption">MỘT LẦN BẤM. MỘT HÀNH TRÌNH.</span>
          <div className="orbit-grid">
            <div className="orbit-node node-you">
              <Icon name="home" size={26} />
              <span>Bạn</span>
            </div>
            <div className="orbit-node node-server">
              <Icon name="grid" size={26} />
              <span>Máy xử lý</span>
            </div>
            <div className="orbit-node node-data">
              <Icon name="book" size={26} />
              <span>Dữ liệu</span>
            </div>
            <svg viewBox="0 0 360 270" aria-hidden="true">
              <path d="M85 88H185V155H277" />
              <path className="orbit-return" d="M277 185H185V118H85" />
              <circle className="moving-dot" r="5">
                <animateMotion dur="5s" repeatCount="indefinite" path="M85 88H185V155H277" />
              </circle>
            </svg>
          </div>
          <div className="illustration-foot">
            <span className="live-dot" />
            Một yêu cầu đang tìm câu trả lời
          </div>
        </div>
      </section>
      <div className="home-stats">
        <div>
          <strong>6</strong>
          <span>level kiến thức</span>
        </div>
        <div>
          <strong>36</strong>
          <span>module trong lộ trình</span>
        </div>
        <div>
          <strong>6</strong>
          <span>thí nghiệm mở đầu</span>
        </div>
        <div>
          <strong>7</strong>
          <span>nhánh chuyên sâu</span>
        </div>
      </div>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">THỬ MỘT ĐIỀU NHỎ</span>
            <h2>Chạm vào ý tưởng.</h2>
            <p>Mỗi bài là một câu hỏi, một thí nghiệm và một điều bạn tự hiểu.</p>
          </div>
          <Link to="/explore" className="text-link">
            Tất cả bài học <Icon name="arrow" size={17} />
          </Link>
        </div>
        <div className="lesson-grid">
          {['request', 'cache', 'balance'].map((id, i) => (
            <LessonCard key={id} id={id} index={i} />
          ))}
        </div>
      </section>
      <section className="how-section">
        <span className="eyebrow">MỘT NHỊP HỌC DỄ THEO</span>
        <h2>Dự đoán. Thử. Hiểu.</h2>
        <div className="how-grid">
          {[
            ['01', 'Gặp một câu chuyện', 'Lịch học, thư viện hay hàng chờ ở ngày hội.'],
            ['02', 'Tự thay đổi và quan sát', 'Bấm từng bước để thấy điều vừa xảy ra.'],
            ['03', 'Giải thích và áp dụng', 'Thử một tình huống mới bằng điều đã hiểu.'],
          ].map(([n, t, p]) => (
            <div key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">TỪ NỀN TẢNG ĐẾN CHUYÊN SÂU</span>
            <h2>Một lộ trình. Nhiều điểm bắt đầu.</h2>
          </div>
        </div>
        <div className="level-list">
          {levels.map((level) => (
            <Link key={level.id} to={`/levels/${level.id}`}>
              <span className="level-number">{level.number}</span>
              <div>
                <span className="eyebrow">{level.label}</span>
                <h3>{level.name}</h3>
                <p>{level.subtitle}</p>
              </div>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      </section>
      <aside className="beta-note">
        <strong>Đang xây từng bài, kiểm chứng từng ý.</strong>
        <p>
          Đây là bản thử nghiệm với sáu bài nhập môn. Các module chuyên sâu có trạng thái rõ và sẽ
          được bổ sung theo lộ trình.
        </p>
      </aside>
    </>
  );
}
export function ExplorePage() {
  const [query, setQuery] = useState('');
  const normalize = (s: string) =>
    s
      .toLocaleLowerCase('vi')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');
  const matches = (s: string) => normalize(s).includes(normalize(query));
  const available = lessons.filter((l) =>
    matches(`${l.title} ${l.subtitle} ${l.terms.map((t) => t.english).join(' ')}`),
  );
  const planned = modules.filter((m) => matches(`${m.title} ${m.topics}`));
  return (
    <div className="page-content">
      <span className="eyebrow">KHÁM PHÁ</span>
      <h1>Bắt đầu ở nơi phù hợp.</h1>
      <p className="page-lead">Chọn một câu hỏi để thử ngay, hoặc nhìn toàn bộ lộ trình.</p>
      <div className="search-box">
        <Icon name="search" />
        <input
          aria-label="Tìm bài học hoặc chủ đề"
          placeholder="Tìm cache, dữ liệu, hàng đợi…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <h2>
        Thí nghiệm đang có <span className="count">{available.length}</span>
      </h2>
      {available.length ? (
        <div className="lesson-grid">
          {available.map((l, i) => (
            <LessonCard key={l.id} id={l.id} index={i} />
          ))}
        </div>
      ) : (
        <p className="empty-state">
          Chưa có bài thử cho từ khóa này. Xem các chủ đề trong lộ trình bên dưới.
        </p>
      )}
      <h2 className="spaced-heading">Bản đồ kiến thức</h2>
      {query ? (
        <div className="module-list">
          {planned.map((m) => (
            <div key={m.id}>
              <span className="module-code">{m.id}</span>
              <h3>{m.title}</h3>
              <span className="status-label">Trong lộ trình</span>
            </div>
          ))}
          {!planned.length && <p>Không tìm thấy chủ đề. Thử từ khóa ngắn hơn.</p>}
        </div>
      ) : (
        <div className="level-list">
          {levels.map((l) => (
            <Link to={`/levels/${l.id}`} key={l.id}>
              <span className="level-number">{l.number}</span>
              <div>
                <h3>{l.name}</h3>
                <p>{l.subtitle}</p>
              </div>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      )}
      <h2 className="spaced-heading">Các nhánh chuyên sâu</h2>
      <p className="muted">Đang đặc tả học liệu; mỗi nhánh sẽ có bài và điều kiện đầu vào riêng.</p>
      <div className="track-list">
        {tracks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}
export function LevelPage() {
  const { level: id } = useParams();
  const level = levels.find((l) => l.id === id);
  if (!level) return <NotFound />;
  const available = lessons.filter((l) => l.level === id);
  return (
    <div className="page-content">
      <Link className="back-link" to="/explore">
        ← Về lộ trình
      </Link>
      <span className="eyebrow">
        {level.id} · {level.label}
      </span>
      <h1>{level.name}</h1>
      <p className="page-lead">{level.subtitle}</p>
      {id === 'L0' && (
        <aside className="intro-note">
          <strong>Bạn có thể bắt đầu ngay.</strong>
          <p>
            Chỉ cần biết dùng trình duyệt. Chúng mình sẽ giải thích từ mới, phép tính và cách đọc
            hình đúng lúc cần.
          </p>
        </aside>
      )}
      {available.length > 0 && (
        <>
          <h2>Bài nhập môn đang có</h2>
          <div className="lesson-grid">
            {available.map((l, i) => (
              <LessonCard key={l.id} id={l.id} index={i} />
            ))}
          </div>
        </>
      )}
      <h2 className="spaced-heading">6 module trong level này</h2>
      <p className="muted">
        Danh mục dưới đây là phạm vi cần phát triển. Các module đầy đủ đang được biên soạn; bài nhập
        môn chưa thay thế toàn bộ module.
      </p>
      <div className="module-list">
        {modules
          .filter((m) => m.level === id)
          .map((m) => (
            <div key={m.id}>
              <span className="module-code">{m.id}</span>
              <h3>{m.title}</h3>
              <span className="status-label">Đang biên soạn</span>
              <details>
                <summary>Xem các chủ đề</summary>
                <p>{m.topics}</p>
              </details>
            </div>
          ))}
      </div>
    </div>
  );
}
export function ProgressPage() {
  const { progress, saving, replace } = useProgress();
  const file = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState('');
  const done = lessons.filter((l) => progress.lessons[l.id]?.completed);
  const begun = lessons.filter((l) => progress.lessons[l.id]);
  async function importFile(f: File | undefined) {
    if (!f) return;
    try {
      if (f.size > 2_000_000) throw new Error('large');
      const imported = parseProgress(await f.text());
      replace(imported);
      setNotice('Đã nhập bản lưu. Nội dung bản lưu được dùng thay tiến độ hiện tại.');
    } catch {
      setNotice(
        'Chưa nhập được: bản lưu cần là JSON đúng phiên bản và nhỏ hơn 2 MB. Tiến độ hiện tại vẫn được giữ.',
      );
    }
    if (file.current) file.current.value = '';
  }
  function exportFile() {
    const url = URL.createObjectURL(
      new Blob([serializeProgress(progress)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system-design-lab-progress.json';
    a.click();
    URL.revokeObjectURL(url);
    setNotice('Đã tạo bản lưu để tải về. Bạn có thể nhập lại trên thiết bị khác.');
  }
  return (
    <div className="page-content">
      <span className="eyebrow">TIẾN ĐỘ CỦA BẠN</span>
      <h1>Mỗi điều hiểu là một bước.</h1>
      <p className="page-lead">Tiến độ ở trên thiết bị này. Không cần tài khoản để bắt đầu.</p>
      <div className="progress-summary">
        <strong>
          {done.length}
          <small> / {lessons.length}</small>
        </strong>
        <div>
          <h2>Bài nhập môn đã hoàn thành</h2>
          <p>Hoàn thành bài không đồng nghĩa đã thành thạo toàn bộ chủ đề.</p>
        </div>
      </div>
      <p className="save-status" role="status">
        {saving}
      </p>
      {begun.length ? (
        <div className="progress-list">
          {begun.map((l) => (
            <Link key={l.id} to={`/learn/${l.id}`}>
              <Icon name={progress.lessons[l.id]?.completed ? 'check' : 'book'} />
              <div>
                <h3>{l.title}</h3>
                <span>
                  {progress.lessons[l.id]?.completed
                    ? 'Ôn lại và thử thêm'
                    : `Tiếp tục chặng ${(progress.lessons[l.id]?.stage ?? 0) + 1}/4`}
                </span>
              </div>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      ) : (
        <aside className="intro-note">
          <h2>Bắt đầu bằng một câu hỏi nhỏ.</h2>
          <p>Thử theo dấu một yêu cầu hoặc tìm hiểu vì sao lịch học vẫn cũ.</p>
          <Link to="/learn/request" className="button primary">
            Thử bài đầu tiên <Icon name="arrow" />
          </Link>
        </aside>
      )}
      <section className="transfer-panel">
        <h2>Mang tiến độ theo bạn</h2>
        <p>Dữ liệu trình duyệt có thể bị xóa. Xuất bản lưu để giữ một bản trên thiết bị của bạn.</p>
        <div className="lab-controls">
          <button className="button primary" onClick={exportFile}>
            <Icon name="download" />
            Xuất bản lưu
          </button>
          <button className="button secondary" onClick={() => file.current?.click()}>
            Nhập bản lưu
          </button>
          <input
            className="visually-hidden"
            tabIndex={-1}
            aria-hidden="true"
            type="file"
            accept="application/json,.json"
            ref={file}
            onChange={(e) => void importFile(e.target.files?.[0])}
          />
        </div>
        <p className="muted">
          Nhập bản lưu sẽ thay thế tiến độ hiện tại. Hãy xuất bản hiện tại trước nếu bạn muốn giữ cả
          hai.
        </p>
        {notice && (
          <p role="status" className="feedback">
            {notice}
          </p>
        )}
      </section>
    </div>
  );
}
export function NotFound() {
  return (
    <div className="page-content">
      <h1>Chưa tìm thấy trang này.</h1>
      <p>Quay lại lộ trình để chọn một bài đang có.</p>
      <Link className="button primary" to="/explore">
        Về lộ trình
      </Link>
    </div>
  );
}
