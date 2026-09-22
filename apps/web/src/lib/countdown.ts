export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

const EMPTY: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isPast: true,
};

export function getCountdown(targetIso: string, now: Date): CountdownParts {
  const target = new Date(targetIso).getTime();
  if (Number.isNaN(target)) return EMPTY;

  const diff = target - now.getTime();
  if (diff <= 0) return EMPTY;

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isPast: false,
  };
}

export function padUnit(value: number): string {
  return String(Math.max(0, value)).padStart(2, '0');
}
