import { useEffect, useRef, useState } from 'react';
import type { DotLottie } from '@lottiefiles/dotlottie-web';
import wasmUrl from '@lottiefiles/dotlottie-web/dotlottie-player.wasm?url';

// Original project artwork: three packets cross a fixed connection. No remote assets.
const packet = (offset: number) => ({
  ddd: 0,
  ind: offset + 1,
  ty: 4,
  nm: 'Request packet',
  sr: 1,
  ks: {
    o: { a: 0, k: 100 },
    r: { a: 0, k: 0 },
    p: {
      a: 1,
      k: [
        { t: 0, s: [30, 60, 0], e: [210, 60, 0], i: { x: 1, y: 1 }, o: { x: 0, y: 0 } },
        { t: 60, s: [210, 60, 0] },
      ],
    },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  },
  shapes: [
    {
      ty: 'rc',
      d: 1,
      s: { a: 0, k: [18, 18] },
      p: { a: 0, k: [0, offset * 24 - 24] },
      r: { a: 0, k: 4 },
      nm: 'Packet',
    },
    {
      ty: 'fl',
      c: { a: 0, k: offset === 1 ? [0.88, 0.43, 0.22, 1] : [0.11, 0.43, 0.4, 1] },
      o: { a: 0, k: 100 },
      r: 1,
    },
  ],
  ip: 0,
  op: 61,
  st: 0,
  bm: 0,
});
const animation = {
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 61,
  w: 240,
  h: 120,
  nm: 'System Design Lab packets',
  ddd: 0,
  assets: [],
  layers: [0, 1, 2].map(packet),
};
export function LottieSignal({
  label = 'Các gói yêu cầu đi qua kết nối',
  pulse = 0,
}: {
  label?: string;
  pulse?: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const player = useRef<DotLottie | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    void import('@lottiefiles/dotlottie-web')
      .then(({ DotLottie }) => {
        if (disposed || !canvas.current) return;
        DotLottie.setWasmUrl(wasmUrl);
        const instance = new DotLottie({
          canvas: canvas.current,
          data: JSON.stringify(animation),
          autoplay: false,
          loop: false,
          renderConfig: { devicePixelRatio: Math.min(devicePixelRatio, 1.5) },
        });
        player.current = instance;
        instance.addEventListener('load', () => {
          if (!disposed) instance.setFrame(25);
        });
        instance.addEventListener('loadError', () => {
          if (!disposed) setFailed(true);
        });
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });
    const stop = () => {
      player.current?.pause();
      player.current?.setFrame(25);
    };
    media.addEventListener('change', stop);
    return () => {
      disposed = true;
      media.removeEventListener('change', stop);
      player.current?.destroy();
      player.current = null;
    };
  }, []);
  useEffect(() => {
    if (pulse > 0 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      player.current?.setFrame(0);
      player.current?.play();
    }
  }, [pulse]);
  return (
    <span className="lottie-signal" role="img" aria-label={label}>
      {failed ? (
        <span aria-hidden="true">● → ● → ●</span>
      ) : (
        <canvas ref={canvas} width={240} height={120} aria-hidden="true" />
      )}
    </span>
  );
}
