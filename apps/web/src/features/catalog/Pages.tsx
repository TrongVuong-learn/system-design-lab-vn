import { OfflinePanel } from '../offline';
import { ReviewCard } from '../review';
import { SaveStatus } from '../progress/SaveStatus';
import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { lessons, levels, modules, tracks, pathways, lessonLabel } from '../../app/catalog';
import { useProgress } from '../../app/progress';
import {
  MAX_PROGRESS_BYTES,
  parseProgress,
  serializeProgress,
  isLessonComplete,
} from '@sdl/learning-core';
import { Icon } from '../../ui/primitives';
import { LessonSketch } from './LessonSketch';
import { RequestWorkshop } from '../../ui/motion/RequestWorkshop';
import { useWorkshopMotion } from '../../ui/motion/useWorkshopMotion';
import { FeaturedExperiment } from './FeaturedExperiment';

export function LessonCard({ id }: { id: string; index?: number }) {
  const l = lessons.find((l) => l.id === id)!;
  const { progress } = useProgress();
  const done = isLessonComplete(l, progress.lessons[id]);
  return (
    <Link to={`/learn/${id}`} className="lesson-card">
      <div className={`lesson-visual visual-${l.kind}`}>
        <LessonSketch kind={l.kind} />
        {done && (
          <span className="done-badge">
            <Icon name="check" size={14} />
            Đã hoàn thành
          </span>
        )}
      </div>
      <div className="lesson-card-body">
        <div className="lesson-meta">
          <span>
            {l.level} · {lessonLabel(l.id)}
          </span>
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
  const root = useRef<HTMLDivElement>(null);
  useWorkshopMotion(root);
  const { progress } = useProgress();
  const continuation = lessons.find(
    (l) => progress.lessons[l.id] && !isLessonComplete(l, progress.lessons[l.id]),
  );
  return (
    <div ref={root} className="workshop-home">
      <section className="workshop-hero">
        <div className="workshop-intro" data-reveal>
          <h1>
            Hiểu hệ thống.
            <br />
            Bằng cách thử.
          </h1>
          <p>
            Từ một lần bấm đến hàng triệu yêu cầu. Tự tay khám phá cách phần mềm vận hành, bằng
            tiếng Việt.
          </p>
          <Link
            className="button primary"
            to={continuation ? `/learn/${continuation.id}` : '/learn/request'}
          >
            {continuation ? 'Tiếp tục bài đang học' : 'Bắt đầu bài đầu tiên'} <Icon name="arrow" />
          </Link>
          <span className="workshop-intro-note">
            Không cần biết code. Bắt đầu từ điều bạn tò mò.
          </span>
        </div>
        <RequestWorkshop />
      </section>
      <section className="game-invitation" data-reveal>
        <div>
          <h2>Đến lượt bạn vận hành.</h2>
          <p>
            Chia tải. Giữ dữ liệu mới. Vượt giờ cao điểm. Ba game, mỗi quyết định đều có kết quả để
            quan sát.
          </p>
          <Link to="/games" className="button primary">
            Khám phá Game <Icon name="arrow" />
          </Link>
        </div>
        <div className="invitation-diagram" aria-hidden="true">
          <span>request</span>
          <b>→</b>
          <span>
            A<br />B
          </span>
          <b>→</b>
          <span>kết quả</span>
        </div>
      </section>
      <section className="learning-desk" data-reveal>
        <div className="desk-copy">
          <h2>Vì sao lịch học vẫn hiện phòng cũ?</h2>
          <p>Cô giáo đã đổi phòng. Website chưa đổi theo. Thử xem hai nơi đang giữ thông tin gì.</p>
          <Link to="/learn/cache" className="text-link">
            Tìm hiểu cache →
          </Link>
        </div>
        <FeaturedExperiment />
      </section>
      <section className="section notebook-section">
        <div className="section-head">
          <div>
            <h2>Chọn một câu hỏi để thử</h2>
            <p>Bắt đầu với các tình huống quen thuộc. Lộ trình có {lessons.length} bài tự luyện.</p>
          </div>
          <Link to="/explore" className="text-link">
            Xem tất cả bài
          </Link>
        </div>
        <div className="lesson-grid">
          {lessons
            .filter((l) =>
              ['request', 'cache', 'concurrency', 'cpu-io', 'http', 'metrics'].includes(l.id),
            )
            .map((l) => (
              <LessonCard key={l.id} id={l.id} />
            ))}
        </div>
      </section>
      <section className="path-section">
        <div className="path-intro">
          <h2>Sau bài đầu, đi tiếp ở đâu?</h2>
          <p>
            Học theo level hoặc mở chủ đề bạn đang cần. Lộ trình gồm 36 module và 7 nhánh chuyên
            sâu, bài tổng hợp theo level và case thiết kế.
          </p>
          <Link className="text-link" to="/explore">
            Khám phá bản đồ kiến thức
          </Link>
        </div>
        <div className="level-list">
          {levels.map((level) => (
            <Link key={level.id} to={`/levels/${level.id}`}>
              <span className="level-number">{level.id}</span>
              <div>
                <h3>{level.name}</h3>
                <p>{level.subtitle}</p>
              </div>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      </section>
      <aside className="beta-note">
        <strong>Bản thử nghiệm đang có {lessons.length} bài tự luyện.</strong>
        <p>
          Bài cơ chế, bài thiết kế và nhánh chuyên sâu đều có lối vào trong lộ trình. Tiến độ và bản
          nháp thiết kế được lưu trên thiết bị của bạn; tự luyện chưa phải chứng nhận thành thạo.
        </p>
      </aside>
    </div>
  );
}
export function ExplorePage() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const normalize = (s: string) =>
    s
      .toLocaleLowerCase('vi')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');
  const term = query.trim();
  const matches = (s: string) => normalize(s).includes(normalize(term));
  const available = lessons.filter((l) => {
    const track = tracks.find((t) => t.id === group);
    const inGroup =
      group === 'all' ||
      l.level === group ||
      (group === 'capstones' && pathways.capstones.includes(l.id)) ||
      (group === 'cases' && pathways.cases.includes(l.id)) ||
      Boolean(track?.lessonIds.includes(l.id));
    return (
      inGroup &&
      matches(
        `${l.title} ${l.subtitle} ${l.moduleId} ${l.objective} ${l.terms.map((t) => `${t.name} ${t.english}`).join(' ')}`,
      )
    );
  });
  const planned = modules.filter((m) => matches(`${m.title} ${m.topics}`));
  return (
    <div className="page-content explore-workshop">
      <h1>Khám phá bài học</h1>
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
      <div className="pathway-filter">
        <label htmlFor="pathway-select">Học theo lộ trình</label>
        <select
          id="pathway-select"
          value={group}
          onChange={(event) => setGroup(event.target.value)}
        >
          <option value="all">Tất cả bài học</option>
          {levels.map((l) => (
            <option key={l.id} value={l.id}>
              {l.id} · {l.name}
            </option>
          ))}
          <option value="capstones">Sáu bài tổng hợp theo level</option>
          <option value="cases">Tám case thiết kế tích hợp</option>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>
      <h2>
        Bài học đang có <span className="count">{available.length}</span>
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
      {!term && <ReviewCard />}
      <h2 className="spaced-heading">Bản đồ kiến thức</h2>
      {term ? (
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
      <p className="muted">
        Mỗi nhánh có bài cơ chế, đề thiết kế và liên kết học trước. Chọn nhánh để lọc bài ở trên.
      </p>
      <div className="track-list">
        {tracks.map((t) => (
          <button
            className="button secondary"
            key={t.id}
            onClick={() => {
              setGroup(t.id);
              setQuery('');
              document.getElementById('pathway-select')?.focus();
            }}
          >
            {t.title}
          </button>
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
          <h2>Bài học trong level</h2>
          <div className="lesson-grid">
            {available.map((l, i) => (
              <LessonCard key={l.id} id={l.id} index={i} />
            ))}
          </div>
        </>
      )}
      <h2 className="spaced-heading">6 module trong level này</h2>
      <p className="muted">
        Mỗi module có bài để đọc và tự luyện. Hoàn thành bài không đồng nghĩa đã chứng minh mọi năng
        lực của module.
      </p>
      <div className="module-list">
        {modules
          .filter((m) => m.level === id)
          .map((m) => (
            <div key={m.id}>
              <span className="module-code">{m.id}</span>
              <h3>{m.title}</h3>
              <span className="status-label">
                {lessons.filter((l) => l.moduleId === m.id).length} bài tự luyện
              </span>
              <details>
                <summary>Xem các chủ đề</summary>
                <p>{m.topics}</p>
                <ul>
                  {lessons
                    .filter((l) => l.moduleId === m.id)
                    .map((l) => (
                      <li key={l.id}>
                        <Link to={`/learn/${l.id}`}>{l.title}</Link>
                      </li>
                    ))}
                </ul>
              </details>
            </div>
          ))}
      </div>
    </div>
  );
}
export function ProgressPage() {
  const { progress, ready, replace } = useProgress();
  const file = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState('');
  const done = lessons.filter((l) => isLessonComplete(l, progress.lessons[l.id]));
  const begun = lessons.filter((l) => progress.lessons[l.id]);
  async function importFile(f: File | undefined) {
    if (!f) return;
    try {
      if (f.size > MAX_PROGRESS_BYTES) throw new Error('large');
      const imported = parseProgress(await f.text());
      replace(imported);
      setNotice(
        'Đã nhập tiến độ vào tab này. Xem trạng thái lưu phía trên để biết đã ghi trên thiết bị chưa.',
      );
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
      <h1>Tiến độ học của bạn</h1>
      <p className="page-lead">Tiến độ ở trên thiết bị này. Không cần tài khoản để bắt đầu.</p>
      <div className="progress-summary">
        <strong>
          {done.length}
          <small> / {lessons.length}</small>
        </strong>
        <div>
          <h2>Bài tự luyện đã hoàn thành</h2>
          <p>Hoàn thành bài không đồng nghĩa đã thành thạo toàn bộ chủ đề.</p>
        </div>
      </div>
      <SaveStatus showBackupLink={false} />
      {begun.length ? (
        <div className="progress-list">
          {begun.map((l) => (
            <Link key={l.id} to={`/learn/${l.id}`}>
              <Icon name={isLessonComplete(l, progress.lessons[l.id]) ? 'check' : 'book'} />
              <div>
                <h3>{l.title}</h3>
                <span>
                  {isLessonComplete(l, progress.lessons[l.id])
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
      <ReviewCard />
      <OfflinePanel />
      <section className="transfer-panel">
        <h2>Mang tiến độ theo bạn</h2>
        <p>Dữ liệu trình duyệt có thể bị xóa. Xuất bản lưu để giữ một bản trên thiết bị của bạn.</p>
        <div className="lab-controls">
          <button className="button primary" disabled={!ready} onClick={exportFile}>
            <Icon name="download" />
            Xuất bản lưu
          </button>
          <button
            className="button secondary"
            disabled={!ready}
            onClick={() => file.current?.click()}
          >
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
