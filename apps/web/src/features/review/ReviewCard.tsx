import { isSchoolReviewSaved } from './model';
import { Link } from 'react-router';
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
      <div>
        <h2>Ghép các kiến thức lại</h2>
        <p>{review.subtitle}</p>
        <p className="muted">
          {record
            ? `Đã lưu ${saved}/2 lượt ôn. Nhận định do bạn tự đánh giá.`
            : 'Bạn có thể bắt đầu ngay; có liên kết ôn kiến thức nền trong bài.'}
        </p>
      </div>
      <Link className="button secondary" to="/review/school-day">
        {record ? 'Tiếp tục ôn website trường' : 'Thử bài ôn website trường'}
      </Link>
    </section>
  );
}
