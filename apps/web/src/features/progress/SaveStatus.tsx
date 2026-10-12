import { Link } from 'react-router';
import { useProgress } from '../../app/progress';

export function SaveStatus({ showBackupLink = true }: { showBackupLink?: boolean }) {
  const { saving, saveState, retrySave } = useProgress();
  const failed =
    saveState === 'write-error' || saveState === 'read-error' || saveState === 'conflict';
  if (!failed)
    return (
      <p className="save-status" role="status">
        {saving}
      </p>
    );
  return (
    <aside className="save-recovery" aria-label="Bảo vệ tiến độ chưa lưu">
      <p role="alert">{saving}</p>
      <p>
        {saveState === 'conflict'
          ? 'Bản lưu của tab khác được giữ nguyên. Hãy xuất tiến độ trong tab này trước, rồi tải lại trang để mở bản mới nhất.'
          : saveState === 'read-error'
            ? 'Bản lưu cũ không bị ghi đè. Hãy xuất tiến độ đang học trước khi tải lại trang hoặc đóng tab.'
            : 'Thử lưu lại hoặc xuất một bản dự phòng trước khi tải lại trang hay đóng tab.'}
      </p>
      <div className="recovery-actions">
        {saveState === 'write-error' && (
          <button className="button secondary" onClick={retrySave}>
            Thử lưu lại
          </button>
        )}
        {showBackupLink && (
          <Link className="button secondary" to="/progress">
            Mở Tiến độ để xuất bản lưu
          </Link>
        )}
      </div>
    </aside>
  );
}
