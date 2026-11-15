import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { VStack } from '@astryxdesign/core/VStack';
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
      <Banner
        status="warning"
        title={<span role="alert">{saving}</span>}
        description={
          saveState === 'conflict'
            ? 'Bản lưu của tab khác được giữ nguyên. Hãy xuất tiến độ trong tab này trước, rồi tải lại trang để mở bản mới nhất.'
            : saveState === 'read-error'
              ? 'Bản lưu cũ không bị ghi đè. Hãy xuất tiến độ đang học trước khi tải lại trang hoặc đóng tab.'
              : 'Thử lưu lại hoặc xuất một bản dự phòng trước khi tải lại trang hay đóng tab.'
        }
        endContent={
          <VStack gap={2}>
            <HStack gap={2} wrap="wrap" className="recovery-actions">
              {saveState === 'write-error' && <Button label="Thử lưu lại" onClick={retrySave} />}
              {showBackupLink && <Button label="Mở Tiến độ để xuất bản lưu" href="/progress" />}
            </HStack>
          </VStack>
        }
      />
    </aside>
  );
}
