import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';

const labels = ['Trình duyệt', 'Máy chủ', 'Dữ liệu', 'Trả kết quả'];
const descriptions = [
  'Yêu cầu bắt đầu từ trình duyệt của bạn.',
  'Máy chủ nhận yêu cầu và quyết định cần làm gì.',
  'Máy chủ đọc dữ liệu cần cho câu trả lời.',
  'Kết quả trở về để trình duyệt hiển thị cho bạn.',
];

/** Four-station request trace on the home page. The packet moves only when the learner acts. */
export function RequestWorkshop() {
  const [step, setStep] = useState(0);
  const stationX = [40, 160, 280, 400];
  return (
    <Card padding={5} className="request-workshop">
      <VStack gap={4}>
        <svg
          className="workshop-canvas"
          viewBox="0 0 440 120"
          role="img"
          aria-label={`Yêu cầu đang ở chặng ${step + 1}: ${labels[step]}`}
        >
          <line x1="40" y1="50" x2="400" y2="50" className="workshop-track" />
          {stationX.map((x, i) => (
            <g
              key={labels[i]}
              className={
                i === step ? 'station is-current' : i < step ? 'station is-done' : 'station'
              }
            >
              <rect x={x - 26} y="24" width="52" height="52" rx="12" />
              <text x={x} y="56" textAnchor="middle">
                {i + 1}
              </text>
              <text x={x} y="102" textAnchor="middle" className="station-label">
                {labels[i]}
              </text>
            </g>
          ))}
          <circle className="workshop-packet" cx={stationX[step]} cy="14" r="8" />
        </svg>
        <VStack gap={1} className="workshop-caption">
          <Text type="supporting">Đường đi của một yêu cầu</Text>
          <strong aria-live="polite">{labels[step]}</strong>
        </VStack>
        <ol className="workshop-stations visually-hidden">
          {labels.map((label, i) => (
            <li key={label} aria-current={step === i ? 'step' : undefined}>
              {label}
            </li>
          ))}
        </ol>
        <Text as="p" color="secondary" aria-live="polite">
          {descriptions[step]}
        </Text>
        <Button
          variant="primary"
          label={
            step === 0 ? 'Gửi một yêu cầu' : step === 3 ? 'Thử lại hành trình' : 'Đi tiếp một trạm'
          }
          onClick={() => setStep((step + 1) % 4)}
        />
        <Text type="supporting">
          Bốn trạm minh họa. Hệ thống thật còn có mạng, cache và nhiều dịch vụ.
        </Text>
      </VStack>
    </Card>
  );
}
