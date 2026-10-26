import { useEffect, useRef, useState } from 'react';
import { gameInputs, gameResult, type GameState } from '@sdl/learning-core';

type Point = [number, number];
type Packet = {
  from: Point;
  to: Point;
  via?: Point;
  worker?: Point;
  label: string;
  lost?: boolean;
  delay?: number;
};
const position = ([x, y]: Point) => `translate(${x}, ${y})`;

/** Presentation only: every quantity comes from replaying the authoritative game state. */
export function GameScene({ state, pulse }: { state: GameState; pulse: number }) {
  const root = useRef<HTMLElement>(null);
  const [replay, setReplay] = useState(0);
  const [phase, setPhase] = useState(-1);
  const turn = state.actions.length;
  const activePhase = turn ? phase : -1;
  const result = gameResult(state);
  const before = gameResult({ ...state, actions: state.actions.slice(0, -1) });
  const action = state.actions.at(-1) ?? 0;
  const input = gameInputs[state.id][Math.max(0, turn - 1)] ?? 0;
  const finished = result.served - before.served;
  const lost = result.lost - before.lost;
  const fresh = result.correct > before.correct;
  const stages =
    state.id === 'balance'
      ? ['Chọn máy nhận', 'Chuyển cả gói việc', 'Cộng vào tải đã giao']
      : state.id === 'cache'
        ? [
            'Chọn nơi đọc',
            action === 1 ? 'Lấy nguồn và cập nhật cache' : 'Lấy bản đang có trong cache',
            'Đối chiếu với nguồn',
          ]
        : [
            'Việc đến; xếp tối đa 6 chỗ',
            'Mỗi worker xử lý tối đa 2 việc',
            'Xong, còn chờ hoặc bị mất',
          ];
  const packets: Packet[] = [];
  if (turn && state.id === 'balance') {
    packets.push({ from: [149, 30], to: [action === 0 ? 68 : 230, 125], label: String(input) });
  } else if (turn && state.id === 'cache') {
    const label = result.cached ? `v${result.cached}` : '∅';
    packets.push({
      from: [action === 1 ? 53 : 243, 40],
      via: [149, 93],
      to: [149, 153],
      label,
      lost: !fresh,
    });
    if (action === 1) packets.push({ from: [53, 40], to: [243, 40], label, delay: 0.35 });
  } else if (turn && state.id === 'queue') {
    const count = before.waiting + input;
    const accepted = count - lost;
    for (let i = 0; i < count; i++) {
      const isLost = i >= accepted;
      const isDone = !isLost && i < finished;
      const from: Point =
        i < before.waiting ? [31 + i * 43, 77] : [31 + (i - before.waiting) * 43, 19];
      packets.push({
        from,
        via: isLost ? undefined : [31 + i * 43, 77],
        worker: isDone ? [49 + Math.floor(i / 2) * 100, 127] : undefined,
        to: isLost
          ? [220 + (i - accepted) * 24, 185]
          : isDone
            ? [31 + i * 27, 185]
            : [31 + (i - finished) * 43, 77],
        label: isLost ? '×' : isDone ? '✓' : '•',
        lost: isLost,
      });
    }
  }
  useEffect(() => {
    if (!turn || (!pulse && !replay)) return;
    let disposed = false;
    let cleanup = () => {};
    void import('gsap')
      .then(({ gsap }) => {
        if (disposed || !root.current) return;
        const media = gsap.matchMedia();
        media.add(
          {
            normal: '(prefers-reduced-motion: no-preference)',
            reduce: '(prefers-reduced-motion: reduce)',
          },
          (mediaContext) => {
            if (mediaContext.conditions?.reduce) {
              setPhase(-1);
              return;
            }
            const context = gsap.context(() => {
              const elements = root.current!.querySelectorAll<SVGGElement>('[data-packet]');
              const timeline = gsap.timeline({
                onComplete: () => {
                  if (!disposed) setPhase(-1);
                },
              });
              timeline.call(
                () => {
                  if (!disposed) setPhase(0);
                },
                [],
                0,
              );
              elements.forEach((element) => {
                const from = element.dataset.from!;
                const to = element.dataset.to!;
                const via = element.dataset.via;
                const worker = element.dataset.worker;
                const delay = Number(element.dataset.delay ?? 0);
                timeline.fromTo(
                  element,
                  { attr: { transform: from }, opacity: 1 },
                  {
                    attr: { transform: via ?? to },
                    duration: 0.7,
                    ease: 'power2.inOut',
                  },
                  delay,
                );
                if (worker)
                  timeline.to(
                    element,
                    { attr: { transform: worker }, duration: 0.55, ease: 'power2.inOut' },
                    0.8,
                  );
                if (via)
                  timeline.to(
                    element,
                    { attr: { transform: to }, duration: 0.8, ease: 'power2.inOut' },
                    (worker ? 1.5 : 1.05) + delay,
                  );
              });
              timeline.call(
                () => {
                  if (!disposed) setPhase(1);
                },
                [],
                0.7,
              );
              timeline.call(
                () => {
                  if (!disposed) setPhase(2);
                },
                [],
                1.5,
              );
              timeline.to({}, { duration: 0.5 }, 1.5);
            }, root);
            return () => {
              context.revert();
              if (!disposed) setPhase(-1);
            };
          },
        );
        cleanup = () => media.revert();
      })
      .catch(() => {
        if (!disposed) setPhase(-1);
      });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [state, turn, pulse, replay]);

  return (
    <figure ref={root} className={`game-scene scene-${state.id}`} data-phase={activePhase}>
      <div className="scene-heading">
        <strong>{turn ? `Diễn biến lượt ${turn}` : 'Hệ thống chờ bạn'}</strong>
        {turn > 0 && (
          <button className="text-button" onClick={() => setReplay((n) => n + 1)}>
            Xem lại lượt
          </button>
        )}
      </div>
      <svg viewBox="0 0 320 220" aria-hidden="true" className="scene-map">
        {state.id === 'balance' ? (
          <>
            <path className="scene-route" d="M160 35V80H79V125 M160 80H241V125" />
            <text x="160" y="18" textAnchor="middle">
              Gói việc {turn ? input : gameInputs.balance[0]} đơn vị
            </text>
            {[0, 1].map((machine) => (
              <g key={machine}>
                <rect
                  className="scene-machine"
                  x={machine * 162 + 16}
                  y="110"
                  width="126"
                  height="98"
                  rx="14"
                />
                <text x={machine * 162 + 79} y="103" textAnchor="middle">
                  Máy {machine === 0 ? 'A' : 'B'}
                </text>
                {Array.from({ length: result.loads[machine] ?? 0 }, (_, i) => (
                  <rect
                    key={i}
                    className="scene-unit"
                    x={machine * 162 + 25 + (i % 8) * 13}
                    y={i < 8 ? 163 : 149}
                    width="10"
                    height="10"
                    rx="2"
                  />
                ))}
                <text x={machine * 162 + 79} y="196" textAnchor="middle">
                  {result.loads[machine]} / 8 đơn vị
                </text>
              </g>
            ))}
          </>
        ) : state.id === 'cache' ? (
          <>
            <path className="scene-route" d="M64 51H254 M64 51L160 104V164 M254 51L160 104" />
            <rect className="scene-machine" x="10" y="22" width="108" height="67" rx="12" />
            <rect className="scene-machine" x="202" y="22" width="108" height="67" rx="12" />
            <text x="64" y="16" textAnchor="middle">
              Nguồn v{input}
            </text>
            <text x="256" y="16" textAnchor="middle">
              Cache
            </text>
            <text x="64" y="78" textAnchor="middle">
              Bản gốc
            </text>
            <text x="256" y="78" textAnchor="middle">
              {result.cached ? `Đang giữ v${result.cached}` : 'Đang trống'}
            </text>
            <rect
              className={`scene-reader ${turn && !fresh ? 'scene-error' : ''}`}
              x="84"
              y="138"
              width="152"
              height="72"
              rx="14"
            />
            <text x="160" y="132" textAnchor="middle">
              Người nhận
            </text>
            <text x="160" y="200" textAnchor="middle">
              {!turn ? 'Chưa nhận bản tin' : fresh ? 'Đúng phiên bản ✓' : 'Sai / trống ×'}
            </text>
          </>
        ) : (
          <>
            <text x="10" y="14">
              {turn ? input : gameInputs.queue[0]} việc mới đến
            </text>
            <path className="scene-route" d="M160 45V166 M284 50V180" />
            <text x="10" y="69">
              Hàng đợi: 6 chỗ
            </text>
            {Array.from({ length: 6 }, (_, i) => (
              <rect
                key={i}
                className="scene-slot"
                x={27 + i * 43}
                y="73"
                width="30"
                height="30"
                rx="6"
              />
            ))}
            {Array.from({ length: turn ? action + 1 : 1 }, (_, i) => (
              <g key={i}>
                <rect
                  className="scene-machine"
                  x={16 + i * 100}
                  y="119"
                  width="88"
                  height="42"
                  rx="10"
                />
                <text x={60 + i * 100} y="145" textAnchor="middle">
                  Worker {i + 1}
                </text>
              </g>
            ))}
            <text x="10" y="179">
              Xong +{finished}
            </text>
            <text x="232" y="179">
              Mất +{lost}
            </text>
            <text x="160" y="217" textAnchor="middle">
              Còn chờ: {result.waiting} việc
            </text>
          </>
        )}
        {packets.map((packet, i) => (
          <g
            key={`${turn}-${i}`}
            data-packet
            data-from={position(packet.from)}
            data-to={position(packet.to)}
            data-via={packet.via ? position(packet.via) : undefined}
            data-worker={packet.worker ? position(packet.worker) : undefined}
            data-delay={packet.delay}
            transform={position(packet.to)}
          >
            <rect
              className={packet.lost ? 'scene-packet scene-error' : 'scene-packet'}
              width="22"
              height="22"
              rx="5"
            />
            <text className="scene-packet-text" x="11" y="16" textAnchor="middle">
              {packet.label}
            </text>
          </g>
        ))}
      </svg>
      <ol className="scene-stages" aria-label="Các bước minh họa">
        {stages.map((text, i) => (
          <li key={text} aria-current={activePhase === i ? 'step' : undefined}>
            {text}
          </li>
        ))}
      </ol>
      <figcaption>
        {turn ? result.trace.at(-1) : 'Chọn một hành động để xem gói việc hoặc dữ liệu di chuyển.'}
      </figcaption>
      <p className="scene-note">
        {activePhase >= 0 ? 'Đang minh họa lượt vừa chọn. ' : ''}Chuyển động minh họa, không phải
        tốc độ thật.
      </p>
    </figure>
  );
}
