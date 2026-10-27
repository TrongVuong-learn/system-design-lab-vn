import { useState } from 'react';
import { PixelCity } from '../PixelCity';

export function RequestWorkshop() {
  const [step, setStep] = useState(0);
  const labels = ['Trình duyệt', 'Máy chủ', 'Dữ liệu', 'Trả kết quả'];
  const descriptions = [
    'Bưu kiện yêu cầu bắt đầu từ trình duyệt của bạn.',
    'Máy chủ nhận yêu cầu và quyết định cần làm gì.',
    'Máy chủ đọc dữ liệu cần cho câu trả lời.',
    'Kết quả trở về để trình duyệt hiển thị cho bạn.',
  ];
  return (
    <div className="request-workshop">
      <div className="workshop-canvas">
        <PixelCity step={step} />
      </div>
      <div className="workshop-caption">
        <span>Đường đi của một yêu cầu</span>
        <strong aria-live="polite">{labels[step]}</strong>
      </div>
      <ol className="workshop-stations">
        {labels.map((label, i) => (
          <li key={label} aria-current={step === i ? 'step' : undefined}>
            {label}
          </li>
        ))}
      </ol>
      <p className="city-explanation" aria-live="polite">
        {descriptions[step]}
      </p>
      <button className="button primary" onClick={() => setStep((step + 1) % 4)}>
        {step === 0 ? 'Gửi một yêu cầu' : step === 3 ? 'Thử lại hành trình' : 'Đi tiếp một trạm'}
      </button>
      <p className="workshop-note">
        Bốn trạm minh họa. Hệ thống thật còn có mạng, cache và nhiều dịch vụ.
      </p>
    </div>
  );
}
