import { useState } from 'react';
import { cacheStep, initialCache, type CacheCommand } from '@sdl/simulation-engine';
import { Button } from '../../ui/Button';
import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { HStack } from '@astryxdesign/core/HStack';
import { Link } from '@astryxdesign/core/Link';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { VStack } from '@astryxdesign/core/VStack';

export function FeaturedExperiment() {
  const [state, setState] = useState(initialCache);
  const changed = state.source !== state.cached;
  function act(command: CacheCommand) {
    setState((s) => cacheStep(s, command));
  }
  return (
    <Card padding={5} className="featured-experiment">
      <VStack gap={4}>
        <HStack gap={2} hAlign="between" vAlign="center">
          <Text weight="semibold">Thử ngay trên bàn học</Text>
          <Token size="sm" color="blue" label="Cache" />
        </HStack>
        <Grid columns={2} gap={3} className="schedule-pair">
          <Card variant="muted" padding={4} className="schedule-source">
            <VStack gap={1}>
              <Text type="supporting">Lịch chính · Phòng sinh hoạt</Text>
              <strong className="schedule-value">{state.source}</strong>
              <Text type="supporting">Thông tin nguồn</Text>
            </VStack>
          </Card>
          <Card
            variant={changed ? 'yellow' : 'muted'}
            padding={4}
            className={`schedule-copy ${changed ? 'is-stale' : ''}`}
          >
            <VStack gap={1}>
              <Text type="supporting">Bản ghi gần · Phòng sinh hoạt</Text>
              <strong className="schedule-value">{state.cached}</strong>
              <Text type="supporting">{changed ? 'Chưa nhận thay đổi' : 'Đang giống nguồn'}</Text>
            </VStack>
          </Card>
        </Grid>
        <HStack gap={2} wrap="wrap" className="experiment-actions">
          <Button
            label="Đổi phòng ở nguồn"
            onClick={() => act({ type: 'update', value: state.source === 201 ? 205 : 201 })}
          />
          <Button label="Xem lịch" onClick={() => act({ type: 'read' })} />
          <Button label="Lấy lịch mới" onClick={() => act({ type: 'refresh' })} />
        </HStack>
        <p className="experiment-result" role="status">
          {state.reads === 0 && state.source === 201
            ? 'Đổi lịch chính rồi bấm Xem lịch. Bạn sẽ thấy gì?'
            : state.message}
        </p>
        <Link href="/learn/cache">Học bài này từng bước →</Link>
      </VStack>
    </Card>
  );
}
