import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Link } from '@astryxdesign/core/Link';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { LottieSignal } from './LottieSignal';
const related: Record<string, { game: string; title: string }> = {
  request: { game: 'balance', title: 'Một yêu cầu, nhiều nơi xử lý' },
  balance: { game: 'balance', title: 'Chia tải, giữ nhịp' },
  cache: { game: 'cache', title: 'Đừng giao bản cũ' },
  queue: { game: 'queue', title: 'Qua giờ cao điểm' },
};
export function LessonGameBridge({ lessonId }: { lessonId: string }) {
  const [pulse, setPulse] = useState(0);
  const entry = related[lessonId];
  if (!entry) return null;
  return (
    <aside className="lesson-game-bridge">
      <Card variant="muted" padding={5}>
        <HStack gap={4} vAlign="center" wrap="wrap">
          <LottieSignal pulse={pulse} />
          <VStack gap={2} className="bridge-copy">
            <Heading level={2}>Thử cơ chế qua Game</Heading>
            <Text as="p" color="secondary">
              {entry.title}. Gói màu minh họa yêu cầu đang di chuyển, không biểu diễn tốc độ thực.
            </Text>
            <HStack gap={3} vAlign="center" wrap="wrap">
              <Button label="Xem gói tin di chuyển" onClick={() => setPulse(pulse + 1)} />
              <Link href={`/games/${entry.game}`}>Mở game liên quan →</Link>
            </HStack>
          </VStack>
        </HStack>
      </Card>
    </aside>
  );
}
