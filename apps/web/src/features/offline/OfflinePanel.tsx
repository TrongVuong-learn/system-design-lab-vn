import { useEffect, useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '@astryxdesign/core/Card';
import { Code } from '@astryxdesign/core/Code';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import {
  downloadOffline,
  offlineState,
  offlineSupported,
  removeOffline,
  type OfflineState,
} from '../../adapters/offline';
export function OfflinePanel() {
  const [state, setState] = useState<OfflineState>({ active: null, waiting: null });
  const [downloadBytes, setDownloadBytes] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('Đang kiểm tra gói đã tải…');
  const supported = offlineSupported();
  async function check() {
    const next = await offlineState();
    setState(next);
    setNotice(
      next.active?.ready
        ? 'Gói đã tải đủ trên trình duyệt này.'
        : next.active
          ? 'Gói bị thiếu. Cần tải lại khi có mạng.'
          : 'Chưa tải gói học. Cần có mạng để tải lần đầu.',
    );
  }
  useEffect(() => {
    if (!supported) {
      setNotice('Trình duyệt này chưa hỗ trợ tải gói học. Bạn vẫn học online được.');
      return;
    }
    void fetch('/offline.json', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return;
        const info: unknown = await response.json();
        if (
          info &&
          typeof info === 'object' &&
          'bytes' in info &&
          typeof info.bytes === 'number' &&
          Number.isFinite(info.bytes) &&
          info.bytes > 0
        )
          setDownloadBytes(info.bytes);
      })
      .catch(() => {
        /* Metadata is optional; active worker remains the source of readiness. */
      });
    void check().catch(() => setNotice('Chưa kiểm tra được gói học. Bấm kiểm tra lại.'));
  }, [supported]);
  async function act(task: 'download' | 'check' | 'remove') {
    setBusy(true);
    setNotice(
      task === 'download' ? 'Đang tải và kiểm tra toàn bộ gói. Giữ trang mở…' : 'Đang kiểm tra…',
    );
    try {
      if (task === 'remove') {
        await removeOffline();
        setState({ active: null, waiting: null });
        setNotice('Đã xóa gói tải. Tiến độ học vẫn được giữ trên thiết bị.');
      } else if (task === 'download') {
        const next = await downloadOffline();
        setState(next);
        setNotice(
          next.waiting?.ready
            ? 'Bản mới tải đủ, đang chờ. Đóng tất cả tab của website rồi mở lại để dùng bản mới.'
            : 'Gói đã tải đủ trên trình duyệt này. Bạn có thể mở lại bài khi mất mạng.',
        );
      } else await check();
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Chưa tải đủ gói. Kiểm tra mạng hoặc dung lượng rồi thử lại.',
      );
    } finally {
      setBusy(false);
    }
  }
  const pack = state.active ?? state.waiting;
  return (
    <section
      className="transfer-panel offline-panel"
      aria-labelledby="offline-title"
      aria-busy={busy}
    >
      <Card padding={6}>
        <VStack gap={3}>
          <h2 id="offline-title" className="heading-2">
            Học khi mất mạng
          </h2>
          <Text as="p" color="secondary">
            Tải các bài nhập môn và bài ôn đang có, kèm thí nghiệm và font chữ. Các đường dẫn nguồn
            đọc thêm vẫn cần mạng; module đang biên soạn chưa có trong gói.
          </Text>
          {downloadBytes !== null && (
            <Text as="p">
              Gói tải hiện có: {(downloadBytes / 1000000).toFixed(1)} MB (chưa tính nén truyền
              mạng).
            </Text>
          )}
          {pack && (
            <Text as="p">
              Phiên bản <Code>{pack.version}</Code> · {(pack.bytes / 1000000).toFixed(1)} MB ·{' '}
              {pack.files} tệp
            </Text>
          )}
          <p role="status" className="feedback">
            {notice}
          </p>
          {state.waiting?.ready && (
            <Text as="p">
              Bản mới đang chờ. Bài đang mở tiếp tục dùng bản hiện tại; đóng tất cả tab rồi mở lại
              để đổi bản.
            </Text>
          )}
          <HStack gap={2} wrap="wrap">
            <Button
              variant="primary"
              label={state.active?.ready ? 'Tải bản mới nếu có' : 'Tải gói học'}
              isDisabled={!supported || busy}
              onClick={() => void act('download')}
            />
            <Button
              label="Kiểm tra gói"
              isDisabled={!supported || busy}
              onClick={() => void act('check')}
            />
            <Button
              label="Xóa gói tải"
              isDisabled={!supported || busy || !pack}
              onClick={() => void act('remove')}
            />
          </HStack>
          <Text as="p" type="supporting">
            Trình duyệt hoặc hệ điều hành có thể thu hồi dữ liệu tải. Kiểm tra gói trước khi rời
            mạng và xuất bản lưu tiến độ để dự phòng. Xóa gói không xóa tiến độ.
          </Text>
        </VStack>
      </Card>
    </section>
  );
}
