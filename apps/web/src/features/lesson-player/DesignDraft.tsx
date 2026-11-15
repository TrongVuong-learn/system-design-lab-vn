import type { Lesson, LessonProgress } from '@sdl/content-schema';
import { readDesignDraft } from '@sdl/learning-core';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { TextArea } from '@astryxdesign/core/TextArea';
import { VStack } from '@astryxdesign/core/VStack';

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
      <Card variant="muted" padding={5}>
        <VStack gap={4}>
          <h2 id="design-heading" className="heading-2">
            Bản thiết kế của bạn
          </h2>
          <Text as="p">{task.prompt}</Text>
          <Text as="p" type="supporting">
            Viết bằng lời của bạn; có thể dùng mũi tên để vẽ luồng. Bản nháp lưu trên thiết bị và đi
            cùng bản xuất tiến độ. Đừng nhập dữ liệu cá nhân hoặc khóa bí mật.
          </Text>
          {task.deliverables.map((part, index) => (
            <VStack gap={1} className="design-field" key={part.id}>
              <TextArea
                id={`design-${part.id}`}
                label={part.prompt}
                maxLength={2000}
                rows={5}
                value={draft.answers[index] ?? ''}
                onChange={(value) => write(`design-${part.id}`, value)}
              />
              <Text type="supporting">{(draft.answers[index] ?? '').length}/2000 ký tự</Text>
            </VStack>
          ))}
          <details className="model-notes disclosure inline-disclosure">
            <summary>Tiêu chí tự đối chiếu bản thiết kế</summary>
            <VStack gap={2} className="disclosure-body">
              <ul className="check-list">
                {task.rubric.map((criterion) => (
                  <li key={criterion}>{criterion}</li>
                ))}
              </ul>
              <Text as="p" type="supporting">
                Đối chiếu từng tiêu chí và sửa lập luận còn thiếu. Ứng dụng không tự chấm tính đúng
                của phần tự viết.
              </Text>
            </VStack>
          </details>
          <VStack gap={1} className="design-field">
            <TextArea
              id="design-variation"
              label={`Đổi ràng buộc: ${task.variation}`}
              maxLength={2000}
              rows={5}
              value={draft.variation}
              onChange={(value) => write('design-variation', value)}
            />
            <Text type="supporting">{draft.variation.length}/2000 ký tự</Text>
          </VStack>
          <Text as="p" weight="semibold" color={draft.ready ? 'primary' : 'secondary'}>
            {draft.ready
              ? 'Đã có bản nháp ở mọi mục. Nội dung tự viết chưa được chấm.'
              : 'Điền các mục và phần đổi ràng buộc trước khi lưu hoàn thành bài tự luyện.'}
          </Text>
        </VStack>
      </Card>
    </section>
  );
}
