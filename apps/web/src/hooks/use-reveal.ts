import { useLayoutEffect, useRef } from 'react';

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    element.classList.add('reveal');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        element.classList.add('is-visible');
        observer.disconnect();
      },
      { threshold: 0, rootMargin: '0px 0px 12% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
