import { useState } from 'react';
import { Link } from 'react-router';
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
      <LottieSignal pulse={pulse} />
      <div>
        <h2>Thử cơ chế qua Game</h2>
        <p>{entry.title}. Gói màu minh họa yêu cầu đang di chuyển, không biểu diễn tốc độ thực.</p>
        <div className="game-footer-actions">
          <button className="button secondary" onClick={() => setPulse(pulse + 1)}>
            Xem gói tin di chuyển
          </button>
          <Link className="text-link" to={`/games/${entry.game}`}>
            Mở game liên quan →
          </Link>
        </div>
      </div>
    </aside>
  );
}
