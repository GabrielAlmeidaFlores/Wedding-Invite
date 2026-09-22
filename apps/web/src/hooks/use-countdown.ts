import { useEffect, useState } from 'react';
import { getCountdown, type CountdownParts } from '@/lib/countdown';

export function useCountdown(targetIso: string): CountdownParts {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer = 0;

    const tick = () => setNow(new Date());

    const start = () => {
      tick();
      timer = window.setInterval(tick, 1000);
    };

    const stop = () => window.clearInterval(timer);

    const onVisibility = () => {
      stop();
      if (!document.hidden) start();
    };

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return getCountdown(targetIso, now);
}
