import { describe, expect, it } from 'vitest';
import { getCountdown, padUnit } from '@/lib/countdown';

describe('getCountdown', () => {
  it('should return remaining days, hours, minutes and seconds', () => {
    const now = new Date('2026-01-01T00:00:00');
    expect(getCountdown('2026-01-02T01:02:03', now)).toEqual({
      days: 1,
      hours: 1,
      minutes: 2,
      seconds: 3,
      isPast: false,
    });
  });

  it('should finish when the event date has passed', () => {
    const now = new Date('2026-06-02T00:00:00');
    expect(getCountdown('2026-06-01T00:00:00', now).isPast).toBe(true);
  });

  it('should finish when the date is invalid', () => {
    expect(getCountdown('data-invalida', new Date()).isPast).toBe(true);
  });
});

describe('padUnit', () => {
  it('should keep at least two digits', () => {
    expect(padUnit(5)).toBe('05');
    expect(padUnit(128)).toBe('128');
  });
});
