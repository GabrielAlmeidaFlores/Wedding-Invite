import type { UserRole } from '@/lib/backoffice/types';

export function canManageEvent(role: UserRole): boolean {
  return role === 'admin';
}

export function canManageGifts(role: UserRole): boolean {
  return role === 'admin';
}

export function canManageGuests(role: UserRole): boolean {
  return role === 'admin';
}

export function canViewGuests(role: UserRole): boolean {
  return role === 'admin' || role === 'ceremonialist';
}
