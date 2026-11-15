import { isSchoolReviewSaved } from './model';
import { Button } from '../../ui/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { reviews } from '../../app/catalog';
import { useProgress } from '../../app/progress';
export function ReviewCard() {
  const review = reviews.find((r) => r.id === 'school-day');
  const { progress } = useProgress();
  if (!review) return null;
  const record = progress.reviews?.['school-day'];
  const saved =
    Number(isSchoolReviewSaved(record, 'opening')) + Number(isSchoolReviewSaved(record, 'rush'));
  return (
    <section className="review-entry" aria-label="Ôn tổng hợp">
      <div className="review-entry-card">
        <HStack gap={4} hAlign="between" vAlign="center" wrap="wrap">
          <VStack gap={2}>
            <Heading level={2}>Ghép các kiến thức lại</Heading>
            <Text as="p">{review.subtitle}</Text>
            <Text as="p" type="supporting">
              {record
                ? `Đã lưu ${saved}/2 lượt ôn. Nhận định do bạn tự đánh giá.`
                : 'Bạn có thể bắt đầu ngay; có liên kết ôn kiến thức nền trong bài.'}
            </Text>
          </VStack>
          <Button
            variant="primary"
            label={record ? 'Tiếp tục ôn website trường' : 'Thử bài ôn website trường'}
            href="/review/school-day"
          />
        </HStack>
      </div>
    </section>
  );
}
