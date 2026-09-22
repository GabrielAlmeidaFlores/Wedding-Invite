import { useEffect, type RefObject } from 'react';

const COVER_PHOTO_ID = 'cover-photo';

export function useEnvelopeFollow(envelopeRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const envelope = envelopeRef.current;
    const photo = document.getElementById(COVER_PHOTO_ID);
    if (!envelope || !photo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let shift = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      const naturalTop = envelope.getBoundingClientRect().top + window.scrollY - shift;
      const photoTop = photo.getBoundingClientRect().top + window.scrollY;
      const releaseAt = photoTop - window.innerHeight * 0.42;
      const maxShift = Math.max(0, releaseAt - naturalTop);
      const next = Math.min(Math.max(0, window.scrollY - naturalTop), maxShift);
      shift = next;
      envelope.style.transform = `translate3d(0, ${shift}px, 0)`;
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
      envelope.style.transform = '';
    };
  }, [envelopeRef]);
}
