import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { GAME_IDS, gameInputs, gameResult, playGame, type GameId } from '@sdl/learning-core';
import { readGame, writeGame } from '../../adapters/game-repository';
import { LottieSignal } from '../../ui/motion/LottieSignal';
const games = {
  balance: {
    title: 'Chia tải, giữ nhịp',
    lesson: 'balance',
    topic: 'Cân bằng tải',
    intro: 'Sáu gói việc. Hai máy. Bạn chọn nơi nhận mỗi gói để hai máy về đích cùng nhau.',
    rule: 'Máy A và B có cùng tốc độ 1 đơn vị mỗi nhịp. Chia hết 16 đơn vị công việc trước khi chạy. Mục tiêu: mỗi máy nhận 8. Không chia nhỏ một gói. Đây là lập lịch một lô, chưa mô phỏng request đến liên tục.',
    choices: ['Gửi máy A', 'Gửi máy B'],
    hint: 'Đếm cả trọng lượng của gói. Chia đều số gói chưa chắc chia đều tải.',
  },
  cache: {
    title: 'Đừng giao bản cũ',
    lesson: 'cache',
    topic: 'Cache và dữ liệu mới',
    intro: 'Bảng tin trường đổi liên tục. Trả đúng phiên bản với ít lần đọc nguồn nhất.',
    rule: 'Cache khởi đầu trống. Đọc nguồn tốn 3 và cập nhật cache; đọc cache tốn 1. Mỗi lượt cho biết phiên bản mới nhất ở nguồn. Mục tiêu: đúng cả 6 lượt, chi phí không quá 12. Mô hình cho bạn biết phiên bản nguồn; hệ thống thật cần cơ chế kiểm tra hoặc làm mất hiệu lực cache.',
    choices: ['Đọc cache', 'Đọc nguồn'],
    hint: 'Khi nguồn thay đổi, cache không tự đổi. Lấy từ nguồn một lần rồi tái sử dụng khi phiên bản còn đúng.',
  },
  queue: {
    title: 'Qua giờ cao điểm',
    lesson: 'queue',
    topic: 'Hàng đợi và worker',
    intro: 'Việc đến theo đợt. Thuê vừa đủ worker để không làm rơi việc và không vượt ngân sách.',
    rule: 'Mỗi lượt: việc mới vào hàng đợi tối đa 6 chỗ, phần dư bị mất, rồi mỗi worker xử lý tối đa 2 việc. Mỗi worker tốn 1 mỗi lượt, dù rảnh. Mục tiêu: xử lý đủ 16 việc, không mất việc, chi phí không quá 8 sau 6 lượt. Đây là mô hình theo lượt, không có thời gian khởi động worker.',
    choices: ['1 worker', '2 worker', '3 worker'],
    hint: 'Nhìn trước đợt kế tiếp. Hàng đợi giữ việc tạm thời; thêm worker quá muộn không cứu được việc đã mất.',
  },
};
export function GamesPage() {
  return (
    <div className="page-content games-page">
      <div className="games-heading">
        <div>
          <h1>Chơi để hiểu.</h1>
          <p className="page-lead">Bạn vận hành. Hệ thống trả lời bằng kết quả.</p>
          <p>Ba game ngắn từ bài học. Không đồng hồ đếm ngược, cứ thử và xem điều gì thay đổi.</p>
        </div>
        <LottieSignal />
      </div>
      <div className="game-shelf">
        {GAME_IDS.map((id, i) => (
          <Link className={`game-cover game-cover-${id}`} to={`/games/${id}`} key={id}>
            <div className="game-cover-art" aria-hidden="true">
              {id === 'balance' ? (
                <>
                  <span className="tower">
                    A<i />
                    <i />
                    <i />
                  </span>
                  <span className="tower">
                    B<i />
                    <i />
                  </span>
                </>
              ) : id === 'cache' ? (
                <>
                  <span className="version-sheet">v1</span>
                  <span className="version-sheet fresh">v2</span>
                </>
              ) : (
                <span className="queue-art">
                  {Array.from({ length: 6 }, (_, n) => (
                    <i key={n} />
                  ))}
                </span>
              )}
            </div>
            <div>
              <span className="game-topic">{games[id].topic} · 6 lượt</span>
              <h2>{games[id].title}</h2>
              <p>{games[id].intro}</p>
              <strong>
                Vào chơi <span aria-hidden="true">↗</span>
              </strong>
            </div>
            <span className="visually-hidden">Game {i + 1}</span>
          </Link>
        ))}
      </div>
      <aside className="intro-note">
        <h2>Thử sai cũng có ích.</h2>
        <p>
          Mỗi lượt đều có nhật ký và giải thích. Phiên game lưu riêng trên thiết bị, không tự đánh
          dấu hoàn thành bài học. Bản xuất tiến độ học chưa bao gồm game.
        </p>
        <Link className="text-link" to="/explore">
          Mở các bài học liên quan →
        </Link>
      </aside>
    </div>
  );
}
function PlaySession({ id }: { id: GameId }) {
  const [state, setState] = useState(() => readGame(id));
  const [saveFailed, setSaveFailed] = useState(false);
  const game = games[id];
  const result = gameResult(state);
  const turn = state.actions.length;
  function choose(action: number) {
    const next = playGame(state, action);
    setState(next);
    setSaveFailed(!writeGame(next));
  }
  function reset() {
    const next = { id, actions: [] };
    setState(next);
    setSaveFailed(!writeGame(next));
  }
  return (
    <div className="page-content game-session">
      <Link to="/games" className="back-link">
        ← Tất cả game
      </Link>
      <h1>{game.title}</h1>
      <p className="page-lead">{game.intro}</p>
      <div className="game-layout">
        <section className="game-board" aria-label="Bàn chơi">
          <div className="game-board-head">
            <strong>{result.done ? 'Kết thúc phiên' : `Lượt ${turn + 1} / 6`}</strong>
            <LottieSignal pulse={turn} />
          </div>
          <p className="game-goal">
            {id === 'balance'
              ? 'Mục tiêu: 8 đơn vị tải cho mỗi máy.'
              : id === 'cache'
                ? 'Mục tiêu: 6 lần trả đúng, chi phí tối đa 12.'
                : 'Mục tiêu: xong 16 việc, không mất việc, chi phí tối đa 8.'}
          </p>
          <details className="game-how">
            <summary>Cách tính mỗi lượt</summary>
            <p>{game.rule}</p>
          </details>
          <div className="game-workload">
            <span>
              {id === 'balance'
                ? 'Trọng lượng các gói'
                : id === 'cache'
                  ? 'Phiên bản nguồn theo lượt'
                  : 'Việc đến theo lượt'}
            </span>
            <div className="workload-strip">
              {gameInputs[id].map((value, i) => (
                <span
                  key={i}
                  className={i === turn ? 'current-work' : i < turn ? 'past-work' : ''}
                  aria-current={i === turn ? 'step' : undefined}
                >
                  {id === 'cache' ? 'v' : ''}
                  {value}
                </span>
              ))}
            </div>
          </div>
          {id === 'balance' ? (
            <div className="load-lanes">
              {result.loads.map((load, i) => (
                <div key={i}>
                  <span>
                    Máy {i === 0 ? 'A' : 'B'} <strong>{load} / 8</strong>
                  </span>
                  <meter
                    min={0}
                    max={16}
                    value={load}
                    aria-label={`Tải máy ${i === 0 ? 'A' : 'B'}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <dl className="game-stats">
              {(id === 'cache'
                ? [
                    ['Cache', result.cached ? `v${result.cached}` : 'Trống'],
                    ['Trả đúng', `${result.correct} / ${turn}`],
                    ['Chi phí', `${result.cost} / 12`],
                  ]
                : [
                    ['Đã xử lý', `${result.served} / 16`],
                    ['Đang chờ', result.waiting],
                    ['Bị mất', result.lost],
                    ['Chi phí', `${result.cost} / 8`],
                  ]
              ).map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
          {!result.done && (
            <div className="game-actions">
              {game.choices.map((choice, i) => (
                <button className="button primary" key={choice} onClick={() => choose(i)}>
                  {choice}
                </button>
              ))}
            </div>
          )}
          <div role="status" className="game-feedback">
            {result.done ? (
              <>
                <h2>{result.won ? 'Đạt mục tiêu!' : 'Thử một cách khác nhé.'}</h2>
                <p>{game.hint}</p>
              </>
            ) : (
              <p>
                {result.trace.at(-1) ?? 'Xem luật và dãy công việc, rồi chọn hành động đầu tiên.'}
              </p>
            )}
          </div>
          {saveFailed && (
            <p role="alert">
              Chưa lưu được phiên game. Bạn vẫn chơi tiếp được trong tab này; tải lại có thể mất
              lượt mới.
            </p>
          )}
          <div className="game-footer-actions">
            <button className="button secondary" onClick={reset}>
              Chơi lại từ đầu
            </button>
            <Link className="text-link" to={`/learn/${game.lesson}`}>
              Học cơ chế này →
            </Link>
          </div>
        </section>
        <aside className="game-rules">
          <details>
            <summary>Gợi ý chiến thuật</summary>
            <p>{game.hint}</p>
          </details>
          <h2>Nhật ký lượt chơi</h2>
          {result.trace.length ? (
            <ol>
              {result.trace.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ol>
          ) : (
            <p>Hành động của bạn sẽ xuất hiện ở đây.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
export function GamePage() {
  const { id } = useParams();
  return GAME_IDS.includes(id as GameId) ? (
    <PlaySession key={id} id={id as GameId} />
  ) : (
    <div className="page-content">
      <h1>Chưa có game này.</h1>
      <Link to="/games">Về mục Game</Link>
    </div>
  );
}
