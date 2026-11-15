import { OfflinePanel } from '../offline';
import { ReviewCard } from '../review';
import { SaveStatus } from '../progress/SaveStatus';
import { Fragment, useRef, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router';
import { Button } from '../../ui/Button';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Link } from '@astryxdesign/core/Link';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';
import { lessons, levels, modules, tracks, pathways, lessonLabel } from '../../app/catalog';
import { useProgress } from '../../app/progress';
import {
  MAX_PROGRESS_BYTES,
  parseProgress,
  serializeProgress,
  isLessonComplete,
} from '@sdl/learning-core';
import { Icon } from '../../ui/primitives';
import { PageHeader, RowLink, SectionHeader } from '../../ui/layout';
import { LessonSketch } from './LessonSketch';
import { RequestWorkshop } from '../../ui/motion/RequestWorkshop';
import { FeaturedExperiment } from './FeaturedExperiment';

type LessonState = 'new' | 'begun' | 'done';

function useLessonState(id: string): LessonState {
  const { progress } = useProgress();
  const l = lessons.find((l) => l.id === id)!;
  if (isLessonComplete(l, progress.lessons[id])) return 'done';
  return progress.lessons[id]?.stage ? 'begun' : 'new';
}

const actionLabel: Record<LessonState, string> = {
  new: 'Bắt đầu thí nghiệm',
  begun: 'Tiếp tục học',
  done: 'Ôn lại bài',
};

/**
 * A lesson entry. The full card carries the mechanism sketch; `compact` is a one-line
 * row for long lists, where 85 full cards would bury the page.
 */
export function LessonCard({ id, compact = false }: { id: string; compact?: boolean }) {
  const l = lessons.find((l) => l.id === id)!;
  const state = useLessonState(id);
  if (compact)
    return (
      <RouterLink
        to={`/learn/${id}`}
        className="lesson-card lesson-row"
        data-level={l.level}
        data-state={state}
      >
        <span className={`lesson-row-thumb visual-${l.kind}`} aria-hidden="true">
          <LessonSketch kind={l.kind} />
        </span>
        <span className="lesson-row-text">
          <h3 className="lesson-row-title">{l.title}</h3>
          <span className="lesson-row-sub">{l.subtitle}</span>
          <span className="lesson-row-meta">
            <span className="level-chip">{l.level}</span>
            {state === 'done' ? (
              <span className="state-done">
                <Icon name="check" size={16} /> Đã hoàn thành
              </span>
            ) : state === 'begun' ? (
              <span className="state-begun">Đang học</span>
            ) : (
              <span>{l.minutes} phút</span>
            )}
          </span>
        </span>
      </RouterLink>
    );
  return (
    <RouterLink to={`/learn/${id}`} className="lesson-card" data-level={l.level} data-state={state}>
      <div className="lesson-card-surface">
        <div className={`lesson-visual visual-${l.kind}`}>
          <LessonSketch kind={l.kind} />
        </div>
        <div className="lesson-card-body">
          <p className="lesson-meta">
            <span className="level-chip">{l.level}</span>
            <span>{lessonLabel(l.id)}</span>
            <span>{l.minutes} phút</span>
            {state === 'done' && (
              <span className="state-done">
                <Icon name="check" size={16} /> Đã hoàn thành
              </span>
            )}
          </p>
          <Heading level={3}>{l.title}</Heading>
          <Text as="p" color="secondary">
            {l.subtitle}
          </Text>
          <span className="card-action">
            {actionLabel[state]}
            <Icon name="arrow" size={18} />
          </span>
        </div>
      </div>
    </RouterLink>
  );
}

/** Six levels as colored tiles. Each is a real link; progress comes from saved data. */
function LevelList({ withNumber = false }: { withNumber?: boolean }) {
  const { progress } = useProgress();
  return (
    <div className="level-list">
      {levels.map((level) => {
        const inLevel = lessons.filter((l) => l.level === level.id);
        const done = inLevel.filter((l) => isLessonComplete(l, progress.lessons[l.id])).length;
        return (
          <RouterLink
            key={level.id}
            to={`/levels/${level.id}`}
            className="level-tile"
            data-level={level.id}
          >
            <span className="level-code" aria-hidden={!withNumber}>
              {withNumber ? level.number : level.id}
            </span>
            <span className="level-tile-text">
              <strong>{level.name}</strong>
              <span>{level.subtitle}</span>
            </span>
            <span className="level-tile-count">
              {done > 0 ? `${done}/${inLevel.length} bài` : `${inLevel.length} bài`}
            </span>
          </RouterLink>
        );
      })}
    </div>
  );
}

const starters = ['request', 'cache', 'concurrency', 'cpu-io', 'http', 'metrics'];

export function HomePage() {
  const { progress } = useProgress();
  const continuation = lessons.find(
    (l) => progress.lessons[l.id] && !isLessonComplete(l, progress.lessons[l.id]),
  );
  const doneCount = lessons.filter((l) => isLessonComplete(l, progress.lessons[l.id])).length;
  return (
    <div className="home">
      <section className="home-hero">
        <div className="wrap home-hero-inner">
          <div className="home-intro">
            <Heading level={1} type="display-2">
              Hiểu hệ thống bằng cách tự tay thử.
            </Heading>
            <Text as="p" type="large" weight="normal" color="secondary">
              Một yêu cầu đi đâu sau lần bấm? Gửi nó qua từng chặng, rồi khám phá cách phần mềm vận
              hành qua những thí nghiệm nhỏ.
            </Text>
            <HStack gap={3} wrap="wrap">
              <Button
                variant="primary"
                size="lg"
                label={continuation ? 'Tiếp tục bài đang học' : 'Bắt đầu bài đầu tiên'}
                href={continuation ? `/learn/${continuation.id}` : '/learn/request'}
              />
              <Button size="lg" label="Xem lộ trình" href="/explore" />
            </HStack>
            <p className="home-reassure">Không cần biết code. Bắt đầu từ điều bạn tò mò.</p>
          </div>
          <RequestWorkshop />
        </div>
      </section>

      {continuation && (
        <section className="wrap home-resume" aria-label="Bài đang học">
          <RouterLink
            to={`/learn/${continuation.id}`}
            className="resume-card"
            data-level={continuation.level}
          >
            <span className="level-chip">{continuation.level}</span>
            <span className="resume-text">
              <span>Bạn đang học dở</span>
              <strong>{continuation.title}</strong>
            </span>
            <span className="resume-stage">
              Đang ở chặng {(progress.lessons[continuation.id]?.stage ?? 0) + 1}/4
              {doneCount > 0 && `, đã xong ${doneCount} bài`}
            </span>
            <Icon name="arrow" />
          </RouterLink>
        </section>
      )}

      <section className="wrap home-section">
        <SectionHeader
          title="Chọn một câu hỏi để thử"
          description={`Bắt đầu với các tình huống quen thuộc. Lộ trình có ${lessons.length} bài tự luyện.`}
          action={<Link href="/explore">Xem tất cả bài</Link>}
        />
        <div className="lesson-grid lesson-rail">
          {starters.map((id) => (
            <LessonCard key={id} id={id} />
          ))}
        </div>
      </section>

      <section className="home-desk">
        <div className="wrap home-desk-inner">
          <div className="home-desk-copy">
            <Heading level={2}>Vì sao lịch học vẫn hiện phòng cũ?</Heading>
            <Text as="p">
              Cô giáo đã đổi phòng. Website chưa đổi theo. Thử xem hai nơi đang giữ thông tin gì.
            </Text>
            <Link href="/learn/cache">Tìm hiểu cache</Link>
          </div>
          <FeaturedExperiment />
        </div>
      </section>

      <section className="wrap home-section home-path">
        <SectionHeader
          title="Sáu khu, một lộ trình"
          description="Học theo level hoặc mở chủ đề bạn đang cần. Lộ trình gồm 36 module và 7 nhánh chuyên sâu, bài tổng hợp theo level và case thiết kế."
          action={<Link href="/explore">Khám phá sáu khu học</Link>}
        />
        <LevelList />
      </section>

      <section className="wrap home-games">
        <div className="home-games-card">
          <div>
            <Heading level={2}>Ba game, ba cơ chế</Heading>
            <Text as="p">
              Chia tải. Giữ dữ liệu mới. Vượt giờ cao điểm. Mỗi quyết định đều có kết quả để quan
              sát.
            </Text>
          </div>
          <Button variant="primary" size="lg" label="Khám phá Game" href="/games" />
        </div>
      </section>

      <section className="wrap home-note" aria-label="Về bản thử nghiệm">
        <strong>Bản thử nghiệm đang có {lessons.length} bài tự luyện.</strong>
        <p>
          Bài cơ chế, bài thiết kế và nhánh chuyên sâu đều có lối vào trong lộ trình. Tiến độ và bản
          nháp thiết kế được lưu trên thiết bị của bạn; tự luyện chưa phải chứng nhận thành thạo.
        </p>
      </section>
    </div>
  );
}

export function ExplorePage() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const [district, setDistrict] = useState<string | null>('L0');
  const normalize = (s: string) =>
    s.toLocaleLowerCase('vi').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
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
  const chooseGroup = (value: string) => {
    setGroup(value);
    setQuery('');
    document.getElementById('pathway-select')?.focus();
  };
  const grouped = !term && group === 'all';
  // Catalog order interleaves levels; a grouped list reads level by level.
  const listed = grouped
    ? [...available].sort((a, b) => a.level.localeCompare(b.level))
    : available;
  return (
    <VStack gap={10}>
      <PageHeader
        title="Khám phá bài học"
        lead="Sáu khu học từ nền tảng đến thiết kế hệ thống. Chọn khu hoặc tìm thẳng bài bạn cần."
      />
      <div className="explore-filters">
        <TextInput
          label="Tìm bài học hoặc chủ đề"
          placeholder="Tìm cache, dữ liệu, hàng đợi…"
          value={query}
          onChange={(value) => setQuery(value)}
        />
        <VStack gap={1}>
          <label htmlFor="pathway-select" className="field-label">
            Học theo lộ trình
          </label>
          <select
            id="pathway-select"
            className="native-select"
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
        </VStack>
      </div>

      {grouped && (
        <section className="district-map" aria-label="Sáu khu học">
          {levels.map((level) => (
            <div key={level.id} className="district" data-level={level.id}>
              <Collapsible
                isOpen={district === level.id}
                onOpenChange={(open) => setDistrict(open ? level.id : null)}
                trigger={
                  <span className="district-trigger">
                    <span className="level-chip">{level.id}</span>
                    <span className="district-name">{level.name}</span>
                    <span className="district-count">
                      {lessons.filter((l) => l.level === level.id).length} bài
                    </span>
                  </span>
                }
              >
                <VStack gap={3} className="district-content">
                  <Text as="p" color="secondary">
                    {level.subtitle}
                  </Text>
                  <HStack gap={2} wrap="wrap">
                    <Button
                      variant="primary"
                      label={`Mở khu ${level.id}`}
                      href={`/levels/${level.id}`}
                    />
                    <Button label="Lọc bài của khu này" onClick={() => chooseGroup(level.id)} />
                  </HStack>
                </VStack>
              </Collapsible>
            </div>
          ))}
        </section>
      )}

      <VStack gap={4}>
        <HStack gap={3} vAlign="center">
          <Heading level={2}>Bài học đang có</Heading>
          <span className="count-pill">{available.length}</span>
        </HStack>
        {available.length ? (
          <div className="lesson-grid lesson-rows">
            {listed.map((l, i) => (
              <Fragment key={l.id}>
                {grouped && listed[i - 1]?.level !== l.level && (
                  <div className="lesson-group-title" data-level={l.level}>
                    <span className="level-chip">{l.level}</span>
                    {levels.find((v) => v.id === l.level)?.name}
                  </div>
                )}
                <LessonCard id={l.id} compact />
              </Fragment>
            ))}
          </div>
        ) : (
          <Text as="p" color="secondary" className="empty-state">
            Chưa có bài thử cho từ khóa này. Xem các chủ đề trong lộ trình bên dưới.
          </Text>
        )}
      </VStack>

      {!term && <ReviewCard />}

      <VStack gap={4}>
        <Heading level={2}>Bản đồ kiến thức</Heading>
        {term ? (
          <div className="module-list sheet">
            {planned.map((m) => (
              <div key={m.id} className="module-row" data-level={m.level}>
                <span className="level-chip">{m.id}</span>
                <Heading level={3}>{m.title}</Heading>
                <span className="status-label">Trong lộ trình</span>
              </div>
            ))}
            {!planned.length && (
              <Text as="p" color="secondary" className="module-empty">
                Không tìm thấy chủ đề. Thử từ khóa ngắn hơn.
              </Text>
            )}
          </div>
        ) : (
          <LevelList withNumber />
        )}
      </VStack>

      <VStack gap={3}>
        <SectionHeader
          title="Các nhánh chuyên sâu"
          description="Mỗi nhánh có bài cơ chế, đề thiết kế và liên kết học trước. Chọn nhánh để lọc bài ở trên."
        />
        <HStack gap={2} wrap="wrap" className="track-list">
          {tracks.map((t) => (
            <Button key={t.id} label={t.title} onClick={() => chooseGroup(t.id)} />
          ))}
        </HStack>
      </VStack>
    </VStack>
  );
}

export function LevelPage() {
  const { level: id } = useParams();
  const level = levels.find((l) => l.id === id);
  if (!level) return <NotFound />;
  const available = lessons.filter((l) => l.level === id);
  return (
    <VStack gap={10} className="level-page" data-level={level.id}>
      <header className="level-hero" data-level={level.id}>
        <Link href="/explore">Về lộ trình</Link>
        <div className="level-hero-main">
          <span className="level-code" aria-hidden="true">
            {level.id}
          </span>
          <PageHeader
            context={`${level.id} · ${level.label}`}
            title={level.name}
            lead={level.subtitle}
          />
        </div>
        {id === 'L0' && (
          <div className="level-hero-note">
            <strong>Bạn có thể bắt đầu ngay.</strong>
            <p>
              Chỉ cần biết dùng trình duyệt. Chúng mình sẽ giải thích từ mới, phép tính và cách đọc
              hình đúng lúc cần.
            </p>
          </div>
        )}
      </header>
      {available.length > 0 && (
        <VStack gap={4}>
          <Heading level={2}>Bài học trong level</Heading>
          <div className="lesson-grid lesson-rows">
            {available.map((l) => (
              <LessonCard key={l.id} id={l.id} compact />
            ))}
          </div>
        </VStack>
      )}
      <VStack gap={4}>
        <SectionHeader
          title="6 module trong level này"
          description="Mỗi module có bài để đọc và tự luyện. Hoàn thành bài không đồng nghĩa đã chứng minh mọi năng lực của module."
        />
        <div className="module-list sheet">
          {modules
            .filter((m) => m.level === id)
            .map((m) => {
              const moduleLessons = lessons.filter((l) => l.moduleId === m.id);
              return (
                <div key={m.id} className="module-row" data-level={level.id}>
                  <span className="level-chip">{m.id}</span>
                  <Heading level={3}>{m.title}</Heading>
                  <span className="status-label">{moduleLessons.length} bài tự luyện</span>
                  <details className="module-details">
                    <summary>Xem các chủ đề</summary>
                    <VStack gap={2}>
                      <Text as="p" color="secondary">
                        {m.topics}
                      </Text>
                      <ul>
                        {moduleLessons.map((l) => (
                          <li key={l.id}>
                            <Link href={`/learn/${l.id}`}>{l.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </VStack>
                  </details>
                </div>
              );
            })}
        </div>
      </VStack>
    </VStack>
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
  const ratio = done.length / Math.max(lessons.length, 1);
  const ring = 2 * Math.PI * 52;
  return (
    <VStack gap={8} className="progress-page">
      <PageHeader
        title="Tiến độ học của bạn"
        lead="Tiến độ ở trên thiết bị này. Không cần tài khoản để bắt đầu."
      />
      <section className="progress-summary">
        <div className="progress-ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="52" className="ring-track" />
            {ratio > 0 && (
              <circle
                cx="60"
                cy="60"
                r="52"
                className="ring-value"
                strokeDasharray={`${ring * ratio} ${ring}`}
              />
            )}
          </svg>
          <strong className="progress-count">
            {done.length}
            <small> / {lessons.length}</small>
          </strong>
        </div>
        <VStack gap={2}>
          <Heading level={2}>Bài tự luyện đã hoàn thành</Heading>
          <Text as="p" color="secondary">
            Hoàn thành bài không đồng nghĩa đã thành thạo toàn bộ chủ đề.
          </Text>
          <SaveStatus showBackupLink={false} />
        </VStack>
      </section>
      {begun.length ? (
        <div className="progress-list sheet">
          {begun.map((l) => {
            const complete = isLessonComplete(l, progress.lessons[l.id]);
            return (
              <RowLink
                key={l.id}
                to={`/learn/${l.id}`}
                label={l.title}
                description={
                  complete
                    ? 'Ôn lại và thử thêm'
                    : `Tiếp tục chặng ${(progress.lessons[l.id]?.stage ?? 0) + 1}/4`
                }
                start={<Icon name={complete ? 'check' : 'book'} />}
              />
            );
          })}
        </div>
      ) : (
        <section className="progress-empty">
          <div>
            <Heading level={2}>Bắt đầu bằng một câu hỏi nhỏ.</Heading>
            <Text as="p" color="secondary">
              Thử theo dấu một yêu cầu hoặc tìm hiểu vì sao lịch học vẫn cũ.
            </Text>
          </div>
          <Button variant="primary" size="lg" label="Thử bài đầu tiên" href="/learn/request" />
        </section>
      )}
      <section aria-label="Tiến độ sáu khu học" className="progress-districts">
        {levels.map((level) => {
          const total = lessons.filter((l) => l.level === level.id).length;
          const completed = done.filter((l) => l.level === level.id).length;
          return (
            <RouterLink
              key={level.id}
              to={`/levels/${level.id}`}
              className="district-progress"
              data-level={level.id}
            >
              <span className="district-progress-head">
                <span className="level-chip">{level.id}</span>
                <strong>{level.name}</strong>
              </span>
              <ProgressBar
                label={`${level.id}: ${completed} trên ${total} bài tự luyện`}
                isLabelHidden
                value={completed}
                max={Math.max(total, 1)}
              />
              <span className="district-progress-count">
                {completed} / {total} bài tự luyện
              </span>
            </RouterLink>
          );
        })}
      </section>
      <ReviewCard />
      <OfflinePanel />
      <section className="transfer-panel sheet">
        <VStack gap={3}>
          <Heading level={2}>Mang tiến độ theo bạn</Heading>
          <Text as="p" color="secondary">
            Dữ liệu trình duyệt có thể bị xóa. Xuất bản lưu để giữ một bản trên thiết bị của bạn.
          </Text>
          <HStack gap={2} wrap="wrap">
            <Button
              variant="primary"
              icon={<Icon name="download" />}
              label="Xuất bản lưu"
              isDisabled={!ready}
              onClick={exportFile}
            />
            <Button
              label="Nhập bản lưu"
              isDisabled={!ready}
              onClick={() => file.current?.click()}
            />
            <input
              className="visually-hidden"
              tabIndex={-1}
              aria-hidden="true"
              type="file"
              accept="application/json,.json"
              ref={file}
              onChange={(e) => void importFile(e.target.files?.[0])}
            />
          </HStack>
          <Text as="p" type="supporting">
            Nhập bản lưu sẽ thay thế tiến độ hiện tại. Hãy xuất bản hiện tại trước nếu bạn muốn giữ
            cả hai.
          </Text>
          {notice && (
            <p role="status" className="feedback">
              {notice}
            </p>
          )}
        </VStack>
      </section>
    </VStack>
  );
}

export function NotFound() {
  return (
    <VStack gap={4} hAlign="start" className="not-found">
      <PageHeader
        title="Chưa tìm thấy trang này."
        lead="Quay lại lộ trình để chọn một bài đang có."
      />
      <Button variant="primary" label="Về lộ trình" href="/explore" />
    </VStack>
  );
}
