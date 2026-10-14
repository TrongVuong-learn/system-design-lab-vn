import { isSchoolReviewSaved } from './model';
import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router';
import { newSchoolReviewProgress } from '@sdl/learning-core';
import {
  evaluateSchoolReview,
  schoolScenarios,
  sameSchoolConfig,
  type SchoolConfig,
  type SchoolScenarioId,
} from '@sdl/simulation-engine';
import { reviews, lessons } from '../../app/catalog';
import { useProgress } from '../../app/progress';
import { AnnotatedText, TermNote } from '../lesson-player';
import { SaveStatus } from '../progress';
import { Stepper } from '../../ui/primitives';
export function ReviewPage() {
  const { id } = useParams();
  const review = reviews.find((r) => r.id === id);
  const { progress, ready, updateReview, saveState } = useProgress();
  const state = progress.reviews?.['school-day'] ?? newSchoolReviewProgress();
  const scenarioId = state.scenarioId;
  const heading = useRef<HTMLHeadingElement>(null),
    resultHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (ready) heading.current?.focus({ preventScroll: true });
  }, [ready, scenarioId]);
  if (!review)
    return (
      <div className="page-content">
        <h1>Chưa có bài ôn này.</h1>
        <Link to="/explore">Về Khám phá</Link>
      </div>
    );
  if (!ready) return <p role="status">Đang mở lượt ôn…</p>;
  const terms = lessons
    .filter((l) => review.prerequisiteIds.includes(l.id))
    .flatMap((l) => l.terms)
    .filter((t, i, list) => list.findIndex((other) => other.english === t.english) === i);
  const supportsPopover = 'showPopover' in HTMLElement.prototype;
  const scenario = review.scenarios.find((s) => s.id === scenarioId)!;
  const requirements = schoolScenarios[scenarioId];
  const config = state.configs[scenarioId],
    run = state.runs[scenarioId],
    previous = state.previousRuns[scenarioId];
  const result = run ? evaluateSchoolReview(scenarioId, run) : null;
  const old = previous ? evaluateSchoolReview(scenarioId, previous) : null;
  const dirty = !!run && !sameSchoolConfig(config, run);
  function configure(patch: Partial<SchoolConfig>) {
    updateReview({
      ...state,
      configs: { ...state.configs, [scenarioId]: { ...config, ...patch } },
      saved: { ...state.saved, [scenarioId]: false },
    });
  }
  function select(next: SchoolScenarioId) {
    updateReview({ ...state, scenarioId: next });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function simulate() {
    updateReview({
      ...state,
      runs: { ...state.runs, [scenarioId]: { ...config } },
      previousRuns: run ? { ...state.previousRuns, [scenarioId]: run } : state.previousRuns,
      saved: { ...state.saved, [scenarioId]: false },
    });
    requestAnimationFrame(() => resultHeading.current?.focus());
  }
  function reset() {
    const runs = { ...state.runs },
      previousRuns = { ...state.previousRuns };
    delete runs[scenarioId];
    delete previousRuns[scenarioId];
    updateReview({
      ...state,
      configs: { ...state.configs, [scenarioId]: newSchoolReviewProgress().configs[scenarioId] },
      runs,
      previousRuns,
      saved: { ...state.saved, [scenarioId]: false },
    });
  }
  const canSave = !!result?.passed && !dirty && state.reflections[scenarioId].trim().length > 0;
  const saveFailed =
    saveState === 'write-error' || saveState === 'read-error' || saveState === 'conflict';
  const status = (pass: boolean) => (
    <span className={pass ? 'review-pass' : 'review-fail'}>{pass ? 'Đạt' : 'Chưa đạt'}</span>
  );
  return (
    <article className="page-content school-review">
      <Link className="back-link" to="/explore">
        Về Khám phá
      </Link>
      <h1 ref={heading} tabIndex={-1}>
        {review.title}
      </h1>
      <p className="page-lead">{review.introduction}</p>
      <details className="advanced">
        <summary>Nên ôn trước những bài nào?</summary>
        <ul>
          {review.prerequisiteIds.map((id) => (
            <li key={id}>
              <Link to={`/learn/${id}`}>{lessons.find((l) => l.id === id)?.title}</Link>
            </li>
          ))}
        </ul>
      </details>
      <nav className="review-scenarios" aria-label="Chọn tình huống ôn">
        {review.scenarios.map((s, i) => (
          <button
            key={s.id}
            className="button secondary"
            aria-pressed={scenarioId === s.id}
            onClick={() => select(s.id)}
          >
            {i + 1}. {s.title}
            {isSchoolReviewSaved(state, s.id) ? ' · Đã lưu' : ''}
          </button>
        ))}
      </nav>
      {saveFailed && <SaveStatus />}
      <section className="review-brief" aria-labelledby="review-context">
        <h2 id="review-context">{scenario.title}</h2>
        <p>{scenario.context}</p>
        <ul>
          <li>Đọc đủ {requirements.readRate} lượt lịch/giây.</li>
          <li>
            Mỗi giây đến {requirements.jobRate} việc gửi; ban đầu có {requirements.initialQueued}{' '}
            việc chờ. Làm hết hàng chờ sau {requirements.seconds} giây.
          </li>
          <li>
            Nếu dùng cache, thời hạn bản ghi không quá {requirements.maxAgeMinutes} phút trong giả
            định của bài.
          </li>
          <li>Không vượt {requirements.budget} điểm chi phí giả lập.</li>
        </ul>
      </section>
      <section className="lab-panel" aria-label="Chọn phương án website trường">
        <h2>Chọn phương án để chạy thử</h2>
        <p>
          <AnnotatedText
            text="Đường đọc: server → cache nếu bật → nơi lưu lịch. Đường gửi: hàng đợi → worker. Hai luồng độc lập."
            terms={terms}
          />
        </p>
        <Stepper
          label="Server đọc lịch"
          value={config.servers}
          min={1}
          max={4}
          unit="mỗi server làm 6 lượt/giây; nguồn làm 4 lượt/giây"
          onChange={(servers) => configure({ servers })}
        />
        <label className="toggle">
          <input
            type="checkbox"
            checked={config.cache}
            onChange={(e) => configure({ cache: e.target.checked })}
          />
          <span>
            Dùng cache đọc lịch <small>Giả định 75% lượt không đọc nguồn</small>
          </span>
        </label>
        {config.cache && (
          <Stepper
            label="Thời hạn bản ghi"
            value={config.ttl}
            min={1}
            max={10}
            unit="phút; giả định 75% lượt qua cache không đổi"
            onChange={(ttl) => configure({ ttl })}
          />
        )}
        <Stepper
          label="Worker gửi thông báo"
          value={config.workers}
          min={1}
          max={6}
          unit="mỗi worker làm tối đa 2 việc/giây"
          onChange={(workers) => configure({ workers })}
        />
        <p className="muted">
          Mỗi server/worker tốn 1 điểm; cache tốn 1 điểm. Mỗi lần chạy bắt đầu lại từ tải và hàng
          chờ của tình huống.
        </p>
        <div className="lab-controls">
          <button className="button primary" onClick={simulate}>
            Chạy phương án
          </button>
          <button className="button secondary" onClick={reset}>
            Đặt lại phương án
          </button>
        </div>
        {state.hints[scenarioId] > 0 && (
          <div className="review-hints">
            {scenario.hints.slice(0, state.hints[scenarioId]).map((hint, i) => (
              <p key={hint}>
                <strong>Gợi ý {i + 1}: </strong>
                {hint}
              </p>
            ))}
          </div>
        )}
        {state.hints[scenarioId] < 2 && (
          <button
            className="text-button"
            onClick={() =>
              updateReview({
                ...state,
                hints: { ...state.hints, [scenarioId]: state.hints[scenarioId] + 1 },
              })
            }
          >
            Mở gợi ý {state.hints[scenarioId] + 1}
          </button>
        )}
      </section>
      {result && (
        <section className="review-results" aria-label="Kết quả lần chạy gần nhất">
          <h2 ref={resultHeading} tabIndex={-1}>
            Kiểm từng yêu cầu
          </h2>
          <p role="status">
            {dirty
              ? 'Bạn đã đổi phương án. Kết quả bên dưới thuộc lần chạy trước; hãy chạy lại.'
              : result.passed
                ? 'Phương án đạt các ràng buộc của mô hình. Tiếp theo hãy giải thích đánh đổi.'
                : 'Phương án còn yêu cầu chưa đạt. Tìm nguyên nhân rồi thử lại.'}
          </p>
          <ol className="review-checks">
            <li>
              <div>
                <h3>Đọc lịch</h3>
                {status(result.checks.reads)}
              </div>
              <p>
                {result.reads.completed}/{requirements.readRate} lượt hoàn tất trong cửa sổ 1 giây;{' '}
                {result.reads.waiting} lượt còn chờ. Giới hạn công suất ở {result.reads.bottleneck}.
              </p>
            </li>
            <li>
              <div>
                <h3>Gửi thông báo</h3>
                {status(result.checks.notifications)}
              </div>
              <p>
                Đã làm {result.queue.processed} việc, còn {result.queue.queued} việc chờ sau{' '}
                {requirements.seconds} giây. Nhận việc vào hàng đợi chưa phải làm xong.
              </p>
            </li>
            <li>
              <div>
                <h3>Quy tắc độ mới</h3>
                {status(result.checks.freshnessPolicy)}
              </div>
              <p>
                {run!.cache
                  ? `Thời hạn ${run!.ttl} phút, yêu cầu tối đa ${requirements.maxAgeMinutes} phút. Không trả bản ghi hết hạn theo giả định.`
                  : 'Không dùng cache: đọc nguồn trong mô hình lý tưởng.'}{' '}
                Đây là kiểm thời hạn sử dụng bản ghi theo giả định, không đo độ mới trên mạng thật.
              </p>
            </li>
            <li>
              <div>
                <h3>Ngân sách</h3>
                {status(result.checks.budget)}
              </div>
              <p>
                {result.cost}/{requirements.budget} điểm giả lập; giá dịch vụ thật chưa được tính.
              </p>
            </li>
          </ol>
          <details className="advanced">
            <summary>Xem hàng chờ từng giây</summary>
            <p>
              Ban đầu: {requirements.initialQueued} việc. Mỗi giây thêm {requirements.jobRate} việc.
            </p>
            <table className="review-table">
              <caption>Trace của lần chạy gần nhất</caption>
              <thead>
                <tr>
                  <th scope="col">Giây</th>
                  <th scope="col">Làm xong</th>
                  <th scope="col">Còn chờ</th>
                </tr>
              </thead>
              <tbody>
                {result.trace.map((t) => (
                  <tr key={t.second}>
                    <th scope="row">{t.second}</th>
                    <td>{t.doneThisSecond} việc</td>
                    <td>{t.queued} việc</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
          {old && (
            <details className="advanced">
              <summary>So với lần chạy trước</summary>
              <p>Hai lần thử cùng tải và hàng chờ ban đầu; không nối thời gian giữa hai lần.</p>
              <table className="review-table">
                <thead>
                  <tr>
                    <th scope="col">Đại lượng</th>
                    <th scope="col">Trước</th>
                    <th scope="col">Mới</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Đọc xong/giây</th>
                    <td>{old.reads.completed}</td>
                    <td>{result.reads.completed}</td>
                  </tr>
                  <tr>
                    <th scope="row">Việc còn chờ</th>
                    <td>{old.queue.queued}</td>
                    <td>{result.queue.queued}</td>
                  </tr>
                  <tr>
                    <th scope="row">Điểm chi phí</th>
                    <td>{old.cost}</td>
                    <td>{result.cost}</td>
                  </tr>
                </tbody>
              </table>
            </details>
          )}
        </section>
      )}
      <section className="review-reflection" aria-labelledby="reflection-title">
        <h2 id="reflection-title">Giải thích lựa chọn của bạn</h2>
        <label htmlFor="review-reflection">{scenario.reflectionPrompt}</label>
        <textarea
          id="review-reflection"
          rows={4}
          maxLength={1000}
          value={state.reflections[scenarioId]}
          onChange={(e) =>
            updateReview({
              ...state,
              reflections: { ...state.reflections, [scenarioId]: e.target.value },
              saved: { ...state.saved, [scenarioId]: false },
            })
          }
        />
        <p className="muted">
          Bạn tự rà lời giải thích; công cụ không tự chấm nội dung này. Kiểm: đã nêu nguyên nhân,
          phân biệt hai luồng và các yêu cầu và nói được một giới hạn chưa?
        </p>
        <button
          className="button primary"
          disabled={!canSave}
          aria-describedby="review-save-help"
          onClick={() => updateReview({ ...state, saved: { ...state.saved, [scenarioId]: true } })}
        >
          {isSchoolReviewSaved(state, scenarioId) ? 'Đã lưu lượt ôn' : 'Lưu lượt ôn'}
        </button>
        <p id="review-save-help" className="muted">
          {canSave
            ? 'Lưu kết quả mô hình và nhận định của bạn, không chứng nhận thành thạo.'
            : 'Cần chạy phương án hiện tại đạt các ràng buộc và viết nhận định trước khi lưu lượt ôn.'}
        </p>
      </section>
      <details className="advanced">
        <summary>Giải thích từ mới</summary>
        <ul>
          {terms.map((term) => (
            <li key={term.english}>
              {supportsPopover ? (
                <TermNote term={term}>{`${term.name} (${term.english})`}</TermNote>
              ) : (
                <span>
                  {term.name} ({term.english}) — {term.meaning}
                </span>
              )}
            </li>
          ))}
        </ul>
      </details>
      <details className="advanced review-limits">
        <summary>Giả định và nguồn tham khảo</summary>
        <ul>
          {review.limits.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
        {review.sources.map((source) => (
          <p key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.title}
            </a>{' '}
            — {source.supports}
          </p>
        ))}
      </details>
      {!saveFailed && <SaveStatus />}
    </article>
  );
}
