import { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
export function RequestWorkshop() {
  const mount = useRef<HTMLDivElement>(null);
  const control = useRef<((step: number) => void) | null>(null);
  const [step, setStep] = useState(0);
  const latestStep = useRef(0);
  const [hasScene, setHasScene] = useState(false);
  const labels = ['Trình duyệt', 'Máy chủ', 'Dữ liệu', 'Trả kết quả'];
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    void import('three')
      .then((T) => {
        if (disposed || !mount.current) return;
        const element = mount.current;
        let renderer: THREE.WebGLRenderer;
        try {
          renderer = new T.WebGLRenderer({ alpha: true, antialias: true });
        } catch {
          return;
        }
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        renderer.domElement.setAttribute('aria-hidden', 'true');
        element.appendChild(renderer.domElement);
        setHasScene(true);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.set(6, 5, 8);
        camera.lookAt(0, 0, 0);
        scene.add(new T.AmbientLight(0xffffff, 2.4));
        const light = new T.DirectionalLight(0xffffff, 3);
        light.position.set(3, 7, 5);
        scene.add(light);
        const geometry = new T.BoxGeometry(1.2, 0.35, 1.5);
        const teal = new T.MeshStandardMaterial({
          color: 0x1b6e66,
          roughness: 0.4,
          metalness: 0.25,
        });
        const pale = new T.MeshStandardMaterial({ color: 0xcbdcd4, roughness: 0.6 });
        const orange = new T.MeshStandardMaterial({ color: 0xe4753b, roughness: 0.3 });
        const group = new T.Group();
        scene.add(group);
        [-2.2, 0, 2.2].forEach((x, i) => {
          for (let j = 0; j <= i + 1; j++) {
            const box = new T.Mesh(geometry, j % 2 ? teal : pale);
            box.position.set(x, j * 0.42 - 0.7, 0);
            group.add(box);
          }
        });
        const wireGeo = new T.BoxGeometry(5.8, 0.05, 0.08);
        const wire = new T.Mesh(wireGeo, teal);
        wire.position.set(0, -0.9, 1.2);
        group.add(wire);
        const packetGeo = new T.BoxGeometry(0.3, 0.3, 0.3);
        const packet = new T.Mesh(packetGeo, orange);
        group.add(packet);
        packet.position.set(-2.2, -0.65, 1.2);
        let frame = 0;
        const render = () => renderer.render(scene, camera);
        const resize = new ResizeObserver(() => {
          const w = element.clientWidth;
          const h = element.clientHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          render();
        });
        resize.observe(element);
        const media = matchMedia('(prefers-reduced-motion: reduce)');
        const stop = () => {
          cancelAnimationFrame(frame);
          render();
        };
        media.addEventListener('change', stop);
        control.current = (next) => {
          cancelAnimationFrame(frame);
          const start = packet.position.x;
          const target = [-2.2, 0, 2.2, -2.2][next] ?? -2.2;
          const startTime = performance.now();
          function move(now: number) {
            const p = media.matches ? 1 : Math.min(1, (now - startTime) / 650);
            packet.position.x = start + (target - start) * (1 - (1 - p) ** 3);
            render();
            if (p < 1) frame = requestAnimationFrame(move);
          }
          frame = requestAnimationFrame(move);
        };
        control.current(latestStep.current);
        const lost = (event: Event) => {
          event.preventDefault();
          cancelAnimationFrame(frame);
          renderer.domElement.style.display = 'none';
          setHasScene(false);
        };
        renderer.domElement.addEventListener('webglcontextlost', lost);
        cleanup = () => {
          control.current = null;
          cancelAnimationFrame(frame);
          resize.disconnect();
          media.removeEventListener('change', stop);
          renderer.domElement.removeEventListener('webglcontextlost', lost);
          geometry.dispose();
          wireGeo.dispose();
          packetGeo.dispose();
          teal.dispose();
          pale.dispose();
          orange.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
        render();
      })
      .catch(() => {});
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);
  function advance() {
    const next = (step + 1) % 4;
    setStep(next);
    latestStep.current = next;
    control.current?.(next);
  }
  return (
    <div className="request-workshop">
      <div ref={mount} className="workshop-canvas">
        {!hasScene && (
          <div className="workshop-fallback" aria-hidden="true">
            <span>Trình duyệt</span>
            <b>→</b>
            <span>Máy chủ</span>
            <b>→</b>
            <span>Dữ liệu</span>
          </div>
        )}
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
      <button className="button primary" onClick={advance}>
        {step === 0 ? 'Gửi một yêu cầu' : step === 3 ? 'Thử lại hành trình' : 'Đi tiếp một trạm'}{' '}
        <span aria-hidden="true">→</span>
      </button>
      <p className="workshop-note">
        Minh họa bốn trạm. Trong thực tế còn có mạng, cache và nhiều dịch vụ.
      </p>
    </div>
  );
}
