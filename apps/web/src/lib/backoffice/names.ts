import type { GuestRecord } from '@/lib/backoffice/types';

export function normalizePersonName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function guestFullName(guest: Pick<GuestRecord, 'firstName' | 'lastName'>): string {
  return `${guest.firstName} ${guest.lastName}`.replace(/\s+/g, ' ').trim();
}

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
}

export function findGuestByName(
  guests: readonly GuestRecord[],
  fullName: string,
): GuestRecord | undefined {
  const key = normalizePersonName(fullName);
  if (!key) return undefined;
  return guests.find((guest) => normalizePersonName(guestFullName(guest)) === key);
}
