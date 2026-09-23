import { daysUntilDeadline } from '@/lib/backoffice/dates';
import type { GuestRecord, GuestStats, WeddingAlert, WeddingRecord } from '@/lib/backoffice/types';

export function computeGuestStats(guests: readonly GuestRecord[]): GuestStats {
  const total = guests.length;
  let confirmed = 0;
  let pending = 0;
  let declined = 0;

  for (const guest of guests) {
    if (guest.status === 'confirmed') {
      confirmed += 1;
    } else if (guest.status === 'declined') {
      declined += 1;
    } else {
      pending += 1;
    }
  }

  return {
    total,
    confirmed,
    pending,
    declined,
    percent: total === 0 ? 0 : Math.round((confirmed / total) * 100),
  };
}

export function buildWeddingAlerts(
  wedding: WeddingRecord,
  stats: GuestStats,
  now: Date,
): WeddingAlert[] {
  const alerts: WeddingAlert[] = [];
  const missing: string[] = [];

  if (!wedding.bride.trim() || !wedding.groom.trim()) missing.push('nomes dos noivos');
  if (!wedding.dateTimeIso.trim()) missing.push('data do casamento');
  if (!wedding.ceremony.name.trim() || !wedding.ceremony.address.trim()) missing.push('local da cerimônia');
  if (!wedding.reception.name.trim() || !wedding.reception.address.trim()) missing.push('local da festa');

  if (missing.length > 0) {
    alerts.push({
      id: 'incomplete',
      tone: 'warn',
      title: 'Dados do casamento incompletos',
      detail: `Ainda faltam: ${missing.join(', ')}.`,
    });
  }

  const deadlineDays = daysUntilDeadline(wedding.rsvpDeadline, now);
  if (deadlineDays !== null && deadlineDays >= 0 && deadlineDays <= 14) {
    alerts.push({
      id: 'deadline',
      tone: 'warn',
      title: 'Data limite de confirmação se aproximando',
      detail:
        deadlineDays === 0
          ? 'A confirmação encerra hoje.'
          : `Faltam ${deadlineDays} dia${deadlineDays === 1 ? '' : 's'} para o prazo.`,
    });
  }

  if (stats.total > 0 && stats.pending / stats.total >= 0.3) {
    alerts.push({
      id: 'pending',
      tone: 'info',
      title: 'Muitos convidados ainda pendentes',
      detail: `${stats.pending} de ${stats.total} ainda não responderam.`,
    });
  }

  return alerts;
}
