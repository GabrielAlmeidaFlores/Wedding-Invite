export function combineDateTime(date: string, time: string): string {
  const safeTime = time.trim() || '16:00';
  return `${date}T${safeTime.length === 5 ? `${safeTime}:00` : safeTime}`;
}

export function formatClockLabel(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match?.[1] || !match[2]) return '';
  const hour = Number(match[1]);
  const minute = match[2];
  if (!Number.isInteger(hour) || hour > 23) return '';
  if (minute === '00') return `às ${hour}h`;
  return `às ${hour}h${minute}`;
}

export function splitDateTime(iso: string): { date: string; time: string } {
  const [date = '', timePart = '16:00:00'] = iso.split('T');
  return { date, time: timePart.slice(0, 5) };
}

export function formatWeddingDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function daysUntil(iso: string, now: Date): number | null {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return null;
  return Math.ceil((target - now.getTime()) / 86_400_000);
}

export function isDeadlinePassed(deadline: string | null, now: Date): boolean {
  if (!deadline) return false;
  const end = new Date(`${deadline}T23:59:59`).getTime();
  if (Number.isNaN(end)) return false;
  return now.getTime() > end;
}

export function daysUntilDeadline(deadline: string | null, now: Date): number | null {
  if (!deadline) return null;
  return daysUntil(`${deadline}T23:59:59`, now);
}
