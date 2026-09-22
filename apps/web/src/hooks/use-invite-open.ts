import { useEffect, type RefObject } from 'react';

export function useInviteOpen(
  stageRef: RefObject<HTMLElement | null>,
  flapRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const stage = stageRef.current;
    const flap = flapRef.current;
    if (!stage || !flap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const distance = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const top = stage.getBoundingClientRect().top;
      const passed = Math.min(Math.max(-top, 0), distance);
      const progress = passed / distance;
      flap.style.transform = `translate3d(0, ${(-progress * 108).toFixed(3)}%, 0)`;
      stage.style.setProperty('--invite-progress', progress.toFixed(4));
    };

    const onScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [stageRef, flapRef]);
}
