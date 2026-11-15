import { Button } from '../Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
const related: Record<string, { game: string; title: string }> = {
  request: { game: 'balance', title: 'Một yêu cầu, nhiều nơi xử lý' },
  balance: { game: 'balance', title: 'Chia tải, giữ nhịp' },
  cache: { game: 'cache', title: 'Đừng giao bản cũ' },
  queue: { game: 'queue', title: 'Qua giờ cao điểm' },
};
/** Pointer from a lesson to the game that exercises the same mechanism. */
export function LessonGameBridge({ lessonId }: { lessonId: string }) {
  const entry = related[lessonId];
  if (!entry) return null;
  return (
    <aside className="lesson-game-bridge">
      <div className="bridge-copy">
        <Heading level={2}>Thử cơ chế qua Game</Heading>
        <Text as="p" color="secondary">
          {entry.title}. Sáu lượt, không đếm giờ; mỗi quyết định có kết quả để quan sát.
        </Text>
      </div>
      <Button label="Mở game liên quan" href={`/games/${entry.game}`} />
    </aside>
  );
}
