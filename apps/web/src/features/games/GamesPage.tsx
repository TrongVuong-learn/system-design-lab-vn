import { Button } from '@astryxdesign/core/Button';
import { useState } from 'react';
import { GameScene } from './GameScene';
import { useParams } from 'react-router';
import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Link } from '@astryxdesign/core/Link';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { VStack } from '@astryxdesign/core/VStack';
import { PageHeader } from '../../ui/layout';
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
function GamePreview({ id }: { id: GameId }) {
  const [preview, setPreview] = useState(false);
  const state = preview
    ? playGame({ id, actions: [] }, id === 'cache' ? 1 : 0)
    : { id, actions: [] };
  return (
    <article className={`game-cover game-cover-${id}`}>
      <Card padding={0}>
        <div className="game-preview-art">
          <GameScene state={state} pulse={preview ? 1 : 0} />
        </div>
        <VStack gap={2} padding={5} className="game-cover-copy">
          <HStack>
            <Token size="sm" color="blue" label={`${games[id].topic} · 6 lượt`} />
          </HStack>
          <Heading level={2}>{games[id].title}</Heading>
          <Text as="p" color="secondary">
            {games[id].intro}
          </Text>
          <HStack gap={2} wrap="wrap" vAlign="center" className="game-preview-actions">
            <Button
              variant="ghost"
              label={
                preview
                  ? 'Đặt lại xem trước'
                  : id === 'balance'
                    ? 'Thử giao gói đầu'
                    : id === 'cache'
                      ? 'Thử lấy bản tin'
                      : 'Thử chạy băng chuyền'
              }
              onClick={() => setPreview(!preview)}
            />
            <Button variant="primary" label="Vào chơi" href={`/games/${id}`} />
          </HStack>
          <Text type="supporting">Xem trước cơ chế, chưa tính lượt chơi.</Text>
        </VStack>
      </Card>
    </article>
  );
}
export function GamesPage() {
  return (
    <VStack gap={8} className="games-page">
      <HStack gap={4} hAlign="between" vAlign="center" wrap="wrap" className="games-heading">
        <PageHeader title="Chơi để hiểu." lead="Bạn vận hành. Hệ thống trả lời bằng kết quả.">
          <Text as="p" color="secondary">
            Ba game ngắn từ bài học. Không đồng hồ đếm ngược, cứ thử và xem điều gì thay đổi.
          </Text>
        </PageHeader>
        <LottieSignal />
      </HStack>
      <Grid columns={{ minWidth: 280 }} gap={4} className="game-shelf">
        {GAME_IDS.map((id) => (
          <GamePreview key={id} id={id} />
        ))}
      </Grid>
      <Card variant="muted" padding={6} className="intro-note">
        <VStack gap={2} hAlign="start">
          <Heading level={2}>Thử sai cũng có ích.</Heading>
          <Text as="p" color="secondary">
            Mỗi lượt đều có nhật ký và giải thích. Phiên game lưu riêng trên thiết bị, không tự đánh
            dấu hoàn thành bài học. Bản xuất tiến độ học chưa bao gồm game.
          </Text>
          <Link href="/explore">Mở các bài học liên quan →</Link>
        </VStack>
      </Card>
    </VStack>
  );
}
function PlaySession({ id }: { id: GameId }) {
  const [state, setState] = useState(() => readGame(id));
  const [saveFailed, setSaveFailed] = useState(false);
  const [pulse, setPulse] = useState(0);
  const game = games[id];
  const result = gameResult(state);
  const turn = state.actions.length;
  function choose(action: number) {
    const next = playGame(state, action);
    setState(next);
    setPulse((n) => n + 1);
    setSaveFailed(!writeGame(next));
  }
  function reset() {
    const next = { id, actions: [] };
    setState(next);
    setPulse(0);
    setSaveFailed(!writeGame(next));
  }
  return (
    <VStack gap={6} className="game-session">
      <Link href="/games">← Tất cả game</Link>
      <PageHeader title={game.title} lead={game.intro} />
      <div className="game-layout">
        <section className="game-board" aria-label="Bàn chơi">
          <HStack gap={2} hAlign="between" vAlign="center" className="game-board-head">
            <Heading level={2}>{result.done ? 'Kết thúc phiên' : `Lượt ${turn + 1} / 6`}</Heading>
            <LottieSignal pulse={turn} />
          </HStack>
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
                <VStack gap={1} key={i}>
                  <Text>
                    Máy {i === 0 ? 'A' : 'B'} <strong>{load} / 8</strong>
                  </Text>
                  <ProgressBar
                    label={`Tải máy ${i === 0 ? 'A' : 'B'}`}
                    isLabelHidden
                    value={load}
                    max={16}
                    marks={[{ value: 8, label: 'Mục tiêu 8' }]}
                    variant={load > 8 ? 'warning' : 'accent'}
                  />
                </VStack>
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
            <HStack gap={2} wrap="wrap" className="game-actions">
              {game.choices.map((choice, i) => (
                <Button variant="primary" label={choice} key={choice} onClick={() => choose(i)} />
              ))}
            </HStack>
          )}
          <GameScene state={state} pulse={pulse} />
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
          <HStack gap={3} vAlign="center" wrap="wrap" className="game-footer-actions">
            <Button label="Chơi lại từ đầu" onClick={reset} />
            <Link href={`/learn/${game.lesson}`}>Học cơ chế này →</Link>
          </HStack>
        </section>
        <aside className="game-rules">
          <details>
            <summary>Gợi ý chiến thuật</summary>
            <p>{game.hint}</p>
          </details>
          <Heading level={2}>Nhật ký lượt chơi</Heading>
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
    </VStack>
  );
}
export function GamePage() {
  const { id } = useParams();
  return GAME_IDS.includes(id as GameId) ? (
    <PlaySession key={id} id={id as GameId} />
  ) : (
    <VStack gap={3}>
      <PageHeader title="Chưa có game này." />
      <Link href="/games">Về mục Game</Link>
    </VStack>
  );
}
