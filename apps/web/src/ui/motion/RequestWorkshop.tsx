import { useState, type ReactNode } from 'react';
import { Button } from '../Button';

const labels = ['Trình duyệt', 'Máy chủ', 'Dữ liệu', 'Trả kết quả'];
const descriptions = [
  'Yêu cầu bắt đầu từ trình duyệt của bạn.',
  'Máy chủ nhận yêu cầu và quyết định cần làm gì.',
  'Máy chủ đọc dữ liệu cần cho câu trả lời.',
  'Kết quả trở về để trình duyệt hiển thị cho bạn.',
];
const stationX = [62, 182, 302, 422];
const lineY = 92;

/** One drawing per station, so the four stops read as different things, not as steps of a form. */
const glyphs: ReactNode[] = [
  <>
    <rect x="-17" y="-13" width="34" height="26" rx="4" />
    <path d="M-17 -5h34" />
    <path d="M-12 -9h.01M-7 -9h.01" />
  </>,
  <>
    <rect x="-15" y="-15" width="30" height="13" rx="3" />
    <rect x="-15" y="2" width="30" height="13" rx="3" />
    <path d="M-9 -8.5h.01M-9 8.5h.01M-2 -8.5h11M-2 8.5h11" />
  </>,
  <>
    <ellipse cx="0" cy="-10" rx="14" ry="5" />
    <path d="M-14 -10v20c0 2.8 6.3 5 14 5s14-2.2 14-5v-20" />
    <path d="M-14 0c0 2.8 6.3 5 14 5s14-2.2 14-5" />
  </>,
  <>
    <rect x="-17" y="-14" width="34" height="23" rx="4" />
    <path d="M-7 15h14M0 9v6" />
    <path d="m-6 -3 4 4 8-8" />
  </>,
];

/** Request trace on the home page, drawn on a notebook sheet. The packet moves only when the learner acts. */
export function RequestWorkshop() {
  const [step, setStep] = useState(0);
  return (
    <div className="request-workshop">
      <svg
        className="workshop-canvas"
        viewBox="0 0 484 170"
        role="img"
        aria-label={`Yêu cầu đang ở chặng ${step + 1}: ${labels[step]}`}
      >
        <line x1={stationX[0]} y1={lineY} x2={stationX[3]} y2={lineY} className="workshop-track" />
        <line
          x1={stationX[0]}
          y1={lineY}
          x2={stationX[step]}
          y2={lineY}
          className="workshop-track is-travelled"
        />
        {stationX.map((x, i) => (
          <g
            key={labels[i]}
            transform={`translate(${x} ${lineY})`}
            className={i === step ? 'station is-current' : i < step ? 'station is-done' : 'station'}
          >
            <rect x="-34" y="-34" width="68" height="68" rx="18" className="station-tile" />
            <g className="station-glyph">{glyphs[i]}</g>
            <text y="60" textAnchor="middle" className="station-label">
              {labels[i]}
            </text>
          </g>
        ))}
        <g className="workshop-packet" style={{ transform: `translateX(${stationX[step]}px)` }}>
          <circle cy="28" r="11" />
          <path d="m-5 28 3.5 3.5 6.5-7" />
        </g>
      </svg>
      <div className="workshop-caption">
        <span>Đường đi của một yêu cầu</span>
        <strong aria-live="polite">{labels[step]}</strong>
        <p aria-live="polite">{descriptions[step]}</p>
      </div>
      <ol className="workshop-stations visually-hidden">
        {labels.map((label, i) => (
          <li key={label} aria-current={step === i ? 'step' : undefined}>
            {label}
          </li>
        ))}
      </ol>
      <div className="workshop-actions">
        <Button
          variant="primary"
          size="lg"
          label={
            step === 0 ? 'Gửi một yêu cầu' : step === 3 ? 'Thử lại hành trình' : 'Đi tiếp một trạm'
          }
          onClick={() => setStep((step + 1) % 4)}
        />
        <span className="workshop-count" aria-hidden="true">
          Trạm {step + 1} / 4
        </span>
      </div>
      <p className="workshop-footnote">
        Bốn trạm minh họa. Hệ thống thật còn có mạng, cache và nhiều dịch vụ.
      </p>
    </div>
  );
}
