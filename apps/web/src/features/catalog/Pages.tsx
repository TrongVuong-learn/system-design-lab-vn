import { OfflinePanel } from '../offline';
import { ReviewCard } from '../review';
import { SaveStatus } from '../progress/SaveStatus';
import { useRef, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Link } from '@astryxdesign/core/Link';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Token } from '@astryxdesign/core/Token';
import { VStack } from '@astryxdesign/core/VStack';
import { Banner } from '@astryxdesign/core/Banner';
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

export function LessonCard({ id }: { id: string }) {
  const l = lessons.find((l) => l.id === id)!;
  const { progress } = useProgress();
  const done = isLessonComplete(l, progress.lessons[id]);
  const action = done
    ? 'Ôn lại bài'
    : progress.lessons[id]?.stage
      ? 'Tiếp tục học'
      : 'Bắt đầu thí nghiệm';
  return (
    <RouterLink to={`/learn/${id}`} className="lesson-card">
      <Card padding={0} className="lesson-card-surface">
        <div className={`lesson-visual visual-${l.kind}`}>
          <LessonSketch kind={l.kind} />
        </div>
        <VStack gap={2} padding={4} className="lesson-card-body">
          <HStack gap={2} wrap="wrap" vAlign="center">
            <Token size="sm" label={`${l.level} · ${lessonLabel(l.id)}`} />
            <Text type="supporting">{l.minutes} phút</Text>
            {done && <Token size="sm" color="green" label="Đã hoàn thành" />}
          </HStack>
          <Heading level={3}>{l.title}</Heading>
          <Text as="p" color="secondary">
            {l.subtitle}
          </Text>
          <Text weight="semibold" color="accent" className="card-action">
            {action} →
          </Text>
        </VStack>
      </Card>
    </RouterLink>
  );
}

function LevelList({ withNumber = false }: { withNumber?: boolean }) {
  return (
    <VStack gap={0} className="level-list row-list">
      {levels.map((level) => (
        <RowLink
          key={level.id}
          to={`/levels/${level.id}`}
          label={level.name}
          description={level.subtitle}
          start={
            <span className="level-chip" aria-hidden={!withNumber}>
              {withNumber ? level.number : level.id}
            </span>
          }
        />
      ))}
    </VStack>
  );
}

export function HomePage() {
  const { progress } = useProgress();
  const continuation = lessons.find(
    (l) => progress.lessons[l.id] && !isLessonComplete(l, progress.lessons[l.id]),
  );
  return (
    <VStack gap={10} className="home">
      <section className="home-hero">
        <VStack gap={4} className="home-intro">
          <Heading level={1} type="display-2">
            Hiểu hệ thống bằng cách tự tay thử.
          </Heading>
          <Text as="p" type="large" weight="normal" color="secondary">
            Một yêu cầu đi đâu sau lần bấm? Gửi nó qua từng chặng, rồi khám phá cách phần mềm vận
            hành qua những thí nghiệm nhỏ.
          </Text>
          <HStack gap={2} wrap="wrap">
            <Button
              variant="primary"
              size="lg"
              label={continuation ? 'Tiếp tục bài đang học' : 'Bắt đầu bài đầu tiên'}
              href={continuation ? `/learn/${continuation.id}` : '/learn/request'}
            />
            <Button size="lg" label="Xem lộ trình" href="/explore" />
          </HStack>
          <Text type="supporting">Không cần biết code. Bắt đầu từ điều bạn tò mò.</Text>
        </VStack>
        <RequestWorkshop />
      </section>

      <Card variant="muted" padding={6} className="home-games">
        <HStack gap={4} hAlign="between" vAlign="center" wrap="wrap">
          <VStack gap={2}>
            <Heading level={2}>Ba game, ba cơ chế</Heading>
            <Text as="p" color="secondary">
              Chia tải. Giữ dữ liệu mới. Vượt giờ cao điểm. Mỗi quyết định đều có kết quả để quan
              sát.
            </Text>
          </VStack>
          <Button variant="primary" label="Khám phá Game" href="/games" />
        </HStack>
      </Card>

      <section className="home-desk">
        <VStack gap={2}>
          <Heading level={2}>Vì sao lịch học vẫn hiện phòng cũ?</Heading>
          <Text as="p" color="secondary">
            Cô giáo đã đổi phòng. Website chưa đổi theo. Thử xem hai nơi đang giữ thông tin gì.
          </Text>
          <Link href="/learn/cache">Tìm hiểu cache →</Link>
        </VStack>
        <FeaturedExperiment />
      </section>

      <VStack gap={4}>
        <SectionHeader
          title="Chọn một câu hỏi để thử"
          description={`Bắt đầu với các tình huống quen thuộc. Lộ trình có ${lessons.length} bài tự luyện.`}
          action={<Link href="/explore">Xem tất cả bài</Link>}
        />
        <Grid columns={{ minWidth: 260 }} gap={4} className="lesson-grid">
          {lessons
            .filter((l) =>
              ['request', 'cache', 'concurrency', 'cpu-io', 'http', 'metrics'].includes(l.id),
            )
            .map((l) => (
              <LessonCard key={l.id} id={l.id} />
            ))}
        </Grid>
      </VStack>

      <section className="home-path">
        <VStack gap={2}>
          <Heading level={2}>Sáu khu, một lộ trình</Heading>
          <Text as="p" color="secondary">
            Học theo level hoặc mở chủ đề bạn đang cần. Lộ trình gồm 36 module và 7 nhánh chuyên
            sâu, bài tổng hợp theo level và case thiết kế.
          </Text>
          <Link href="/explore">Khám phá sáu khu học</Link>
        </VStack>
        <LevelList />
      </section>

      <Banner
        status="info"
        title={`Bản thử nghiệm đang có ${lessons.length} bài tự luyện.`}
        description="Bài cơ chế, bài thiết kế và nhánh chuyên sâu đều có lối vào trong lộ trình. Tiến độ và bản nháp thiết kế được lưu trên thiết bị của bạn; tự luyện chưa phải chứng nhận thành thạo."
      />
    </VStack>
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
  return (
    <VStack gap={8}>
      <PageHeader
        title="Khám phá bài học"
        lead="Sáu khu học từ nền tảng đến thiết kế hệ thống. Chọn khu hoặc tìm thẳng bài bạn cần."
      />
      <Grid columns={{ minWidth: 260 }} gap={4} className="explore-filters">
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
      </Grid>

      {!term && group === 'all' && (
        <section className="district-map" aria-label="Sáu khu học">
          <Card padding={0}>
            {levels.map((level) => (
              <Collapsible
                key={level.id}
                className="district"
                isOpen={district === level.id}
                onOpenChange={(open) => setDistrict(open ? level.id : null)}
                trigger={
                  <HStack gap={3} vAlign="center">
                    <span className="level-chip">{level.id}</span>
                    <Text weight="semibold">{level.name}</Text>
                  </HStack>
                }
              >
                <VStack gap={2} className="district-content">
                  <Text as="p" color="secondary">
                    {level.subtitle}
                  </Text>
                  <HStack gap={2} wrap="wrap">
                    <Button size="sm" label={`Mở khu ${level.id}`} href={`/levels/${level.id}`} />
                    <Button
                      size="sm"
                      variant="ghost"
                      label="Lọc bài của khu này"
                      onClick={() => chooseGroup(level.id)}
                    />
                  </HStack>
                </VStack>
              </Collapsible>
            ))}
          </Card>
        </section>
      )}

      <VStack gap={4}>
        <HStack gap={2} vAlign="center">
          <Heading level={2}>Bài học đang có</Heading>
          <Token label={String(available.length)} color="blue" />
        </HStack>
        {available.length ? (
          <Grid columns={{ minWidth: 260 }} gap={4} className="lesson-grid">
            {available.map((l) => (
              <LessonCard key={l.id} id={l.id} />
            ))}
          </Grid>
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
          <Card padding={0}>
            <VStack gap={0} className="module-list">
              {planned.map((m) => (
                <div key={m.id} className="module-row">
                  <span className="level-chip">{m.id}</span>
                  <Heading level={3}>{m.title}</Heading>
                  <Token size="sm" label="Trong lộ trình" className="status-label" />
                </div>
              ))}
              {!planned.length && (
                <Text as="p" color="secondary" className="module-empty">
                  Không tìm thấy chủ đề. Thử từ khóa ngắn hơn.
                </Text>
              )}
            </VStack>
          </Card>
        ) : (
          <Card padding={0}>
            <LevelList withNumber />
          </Card>
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
    <VStack gap={8}>
      <VStack gap={4}>
        <Link href="/explore">← Về lộ trình</Link>
        <PageHeader
          context={`${level.id} · ${level.label}`}
          title={level.name}
          lead={level.subtitle}
        />
      </VStack>
      {id === 'L0' && (
        <Banner
          status="success"
          title="Bạn có thể bắt đầu ngay."
          description="Chỉ cần biết dùng trình duyệt. Chúng mình sẽ giải thích từ mới, phép tính và cách đọc hình đúng lúc cần."
        />
      )}
      {available.length > 0 && (
        <VStack gap={4}>
          <Heading level={2}>Bài học trong level</Heading>
          <Grid columns={{ minWidth: 260 }} gap={4} className="lesson-grid">
            {available.map((l) => (
              <LessonCard key={l.id} id={l.id} />
            ))}
          </Grid>
        </VStack>
      )}
      <VStack gap={4}>
        <SectionHeader
          title="6 module trong level này"
          description="Mỗi module có bài để đọc và tự luyện. Hoàn thành bài không đồng nghĩa đã chứng minh mọi năng lực của module."
        />
        <Card padding={0}>
          <VStack gap={0} className="module-list">
            {modules
              .filter((m) => m.level === id)
              .map((m) => {
                const moduleLessons = lessons.filter((l) => l.moduleId === m.id);
                return (
                  <div key={m.id} className="module-row">
                    <span className="level-chip">{m.id}</span>
                    <Heading level={3}>{m.title}</Heading>
                    <Token
                      size="sm"
                      color={moduleLessons.length ? 'blue' : 'default'}
                      label={`${moduleLessons.length} bài tự luyện`}
                      className="status-label"
                    />
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
          </VStack>
        </Card>
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
  return (
    <VStack gap={8}>
      <PageHeader
        title="Tiến độ học của bạn"
        lead="Tiến độ ở trên thiết bị này. Không cần tài khoản để bắt đầu."
      />
      <Card padding={6} className="progress-summary">
        <HStack gap={4} vAlign="center" wrap="wrap">
          <strong className="progress-count">
            {done.length}
            <small> / {lessons.length}</small>
          </strong>
          <VStack gap={1}>
            <Heading level={2}>Bài tự luyện đã hoàn thành</Heading>
            <Text as="p" color="secondary">
              Hoàn thành bài không đồng nghĩa đã thành thạo toàn bộ chủ đề.
            </Text>
          </VStack>
        </HStack>
      </Card>
      <SaveStatus showBackupLink={false} />
      {begun.length ? (
        <Card padding={0}>
          <VStack gap={0} className="progress-list row-list">
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
          </VStack>
        </Card>
      ) : (
        <Card variant="muted" padding={6}>
          <VStack gap={3} hAlign="start">
            <Heading level={2}>Bắt đầu bằng một câu hỏi nhỏ.</Heading>
            <Text as="p" color="secondary">
              Thử theo dấu một yêu cầu hoặc tìm hiểu vì sao lịch học vẫn cũ.
            </Text>
            <Button variant="primary" label="Thử bài đầu tiên" href="/learn/request" />
          </VStack>
        </Card>
      )}
      <section aria-label="Tiến độ sáu khu học">
        <Grid columns={{ minWidth: 220 }} gap={3} className="progress-districts">
          {levels.map((level) => {
            const total = lessons.filter((l) => l.level === level.id).length;
            const completed = done.filter((l) => l.level === level.id).length;
            return (
              <RouterLink key={level.id} to={`/levels/${level.id}`} className="district-progress">
                <Card padding={4}>
                  <VStack gap={2}>
                    <HStack gap={2} vAlign="center">
                      <span className="level-chip">{level.id}</span>
                      <Text weight="semibold">{level.name}</Text>
                    </HStack>
                    <ProgressBar
                      label={`${level.id}: ${completed} trên ${total} bài tự luyện`}
                      isLabelHidden
                      value={completed}
                      max={Math.max(total, 1)}
                    />
                    <Text type="supporting">
                      {completed} / {total} bài tự luyện
                    </Text>
                  </VStack>
                </Card>
              </RouterLink>
            );
          })}
        </Grid>
      </section>
      <ReviewCard />
      <OfflinePanel />
      <Card padding={6} className="transfer-panel">
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
      </Card>
    </VStack>
  );
}

export function NotFound() {
  return (
    <VStack gap={4} hAlign="start">
      <PageHeader
        title="Chưa tìm thấy trang này."
        lead="Quay lại lộ trình để chọn một bài đang có."
      />
      <Button variant="primary" label="Về lộ trình" href="/explore" />
    </VStack>
  );
}
