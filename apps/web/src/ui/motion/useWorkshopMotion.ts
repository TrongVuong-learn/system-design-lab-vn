import { useEffect, type RefObject } from 'react';
export function useWorkshopMotion(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let disposed = false;
    let revert = () => {};
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed || !ref.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add(
          '(prefers-reduced-motion: no-preference)',
          () => {
            const root = ref.current!;
            root.querySelectorAll('[data-reveal]').forEach((element) => {
              gsap.from(element, {
                y: 18,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: { trigger: element, start: 'top 94%', once: true },
                clearProps: 'transform',
              });
            });
            const scene = root.querySelector('.workshop-canvas');
            if (scene)
              gsap.to(scene, {
                y: 24,
                ease: 'none',
                scrollTrigger: {
                  trigger: root.querySelector('.workshop-hero'),
                  start: 'top top',
                  end: 'bottom top',
                  scrub: true,
                },
              });
          },
          ref.current,
        );
        revert = () => media.revert();
      })
      .catch(() => {});
    return () => {
      disposed = true;
      revert();
    };
  }, [ref]);
}
