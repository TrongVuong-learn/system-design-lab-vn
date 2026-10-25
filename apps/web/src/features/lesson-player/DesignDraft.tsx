import type { Lesson, LessonProgress } from '@sdl/content-schema';
import { readDesignDraft } from '@sdl/learning-core';

export function DesignDraft({
  lesson,
  progress,
  onChange,
}: {
  lesson: Lesson;
  progress: LessonProgress;
  onChange(patch: Partial<LessonProgress>): void;
}) {
  const task = lesson.designTask;
  if (!task) return null;
  const draft = readDesignDraft(task, progress.lab);
  function write(key: string, value: string) {
    onChange({ lab: { ...progress.lab, [key]: value }, completed: false });
  }
  return (
    <section className="design-draft" aria-labelledby="design-heading">
      <h2 id="design-heading">Bản thiết kế của bạn</h2>
      <p>{task.prompt}</p>
      <p className="muted">
        Viết bằng lời của bạn; có thể dùng mũi tên để vẽ luồng. Bản nháp lưu trên thiết bị và đi
        cùng bản xuất tiến độ. Đừng nhập dữ liệu cá nhân hoặc khóa bí mật.
      </p>
      {task.deliverables.map((part, index) => (
        <div className="design-field" key={part.id}>
          <label htmlFor={`design-${part.id}`}>{part.prompt}</label>
          <textarea
            id={`design-${part.id}`}
            maxLength={2000}
            rows={5}
            value={draft.answers[index]}
            onChange={(event) => write(`design-${part.id}`, event.target.value)}
          />
          <small>{draft.answers[index]!.length}/2000 ký tự</small>
        </div>
      ))}
      <details className="model-notes">
        <summary>Tiêu chí tự đối chiếu bản thiết kế</summary>
        <ul>
          {task.rubric.map((criterion) => (
            <li key={criterion}>{criterion}</li>
          ))}
        </ul>
        <p>
          Đối chiếu từng tiêu chí và sửa lập luận còn thiếu. Ứng dụng không tự chấm tính đúng của
          phần tự viết.
        </p>
      </details>
      <div className="design-field">
        <label htmlFor="design-variation">Đổi ràng buộc: {task.variation}</label>
        <textarea
          id="design-variation"
          maxLength={2000}
          rows={5}
          value={draft.variation}
          onChange={(event) => write('design-variation', event.target.value)}
        />
        <small>{draft.variation.length}/2000 ký tự</small>
      </div>
      <p>
        {draft.ready
          ? 'Đã có bản nháp ở mọi mục. Nội dung tự viết chưa được chấm.'
          : 'Điền các mục và phần đổi ràng buộc trước khi lưu hoàn thành bài tự luyện.'}
      </p>
    </section>
  );
}
