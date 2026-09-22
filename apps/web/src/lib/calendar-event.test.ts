import { describe, expect, it } from 'vitest';
import { buildCalendarIcs } from '@/lib/calendar-event';

const event = {
  title: 'Casamento de Geísa e João',
  startIso: '2028-05-20T16:00:00',
  durationHours: 2,
  location: 'Igreja Matriz, Centro, Itaberá - SP',
  description: 'Cerimônia às 16h.\nRecepção em seguida.',
  uid: 'casamento-20280520',
};

describe('buildCalendarIcs', () => {
  const ics = buildCalendarIcs(event, new Date('2026-09-22T22:00:00Z'));

  it('should schedule the ceremony in local time and end two hours later', () => {
    expect(ics).toContain('DTSTART:20280520T160000');
    expect(ics).toContain('DTEND:20280520T180000');
    expect(ics).toContain('DTSTAMP:20260922T220000Z');
  });

  it('should escape commas and line breaks', () => {
    expect(ics).toContain('LOCATION:Igreja Matriz\\, Centro\\, Itaberá - SP');
    expect(ics).toContain('DESCRIPTION:Cerimônia às 16h.\\nRecepção em seguida.');
  });

  it('should reject an invalid start', () => {
    expect(() => buildCalendarIcs({ ...event, startIso: 'amanha' }, new Date())).toThrow(
      'Data do evento inválida',
    );
  });
});
