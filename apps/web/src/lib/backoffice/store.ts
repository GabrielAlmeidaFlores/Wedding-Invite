import { createSeedState } from '@/lib/backoffice/seed';
import {
  alignSiteContent,
  applyPublicRsvp,
  restoreContent,
  moveGift,
  removeGift,
  removeGuest,
  saveGift,
  saveGuest,
  updateWedding,
} from '@/lib/backoffice/state';
import type {
  BackofficeState,
  GiftRecord,
  GuestRecord,
  PublicRsvpInput,
  WeddingRecord,
} from '@/lib/backoffice/types';

export const STORAGE_KEY = 'enlace.backoffice.v1';

const listeners = new Set<() => void>();

function readStorage(): BackofficeState | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const value = parsed as Partial<BackofficeState>;
    if (!Array.isArray(value.weddings) || !Array.isArray(value.gifts) || !Array.isArray(value.guests)) {
      return null;
    }
    return { weddings: value.weddings, gifts: value.gifts, guests: value.guests };
  } catch {
    return null;
  }
}

function writeStorage(state: BackofficeState) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const stored = readStorage();
const initial = alignSiteContent(stored ?? createSeedState());
let snapshot: BackofficeState = initial;
if (stored && initial !== stored) writeStorage(initial);

function emit() {
  writeStorage(snapshot);
  listeners.forEach((listener) => listener());
}

function commit(next: BackofficeState) {
  snapshot = next;
  emit();
}

export function getBackofficeState(): BackofficeState {
  return snapshot;
}

export function subscribeBackoffice(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function replaceBackofficeState(next: BackofficeState) {
  commit(next);
}

export function resetBackofficeState() {
  commit(createSeedState());
}

export function restoreOriginalContent() {
  commit(restoreContent(snapshot, createSeedState()));
}

export function patchWedding(weddingId: string, patch: Partial<Omit<WeddingRecord, 'id' | 'slug'>>) {
  commit(updateWedding(snapshot, weddingId, patch, new Date().toISOString()));
}

export function upsertGift(gift: GiftRecord) {
  commit(saveGift(snapshot, gift));
}

export function deleteGift(giftId: string) {
  commit(removeGift(snapshot, giftId));
}

export function reorderGift(weddingId: string, giftId: string, direction: -1 | 1) {
  commit(moveGift(snapshot, weddingId, giftId, direction));
}

export function upsertGuest(guest: GuestRecord) {
  commit(saveGuest(snapshot, guest));
}

export function deleteGuest(guestId: string) {
  commit(removeGuest(snapshot, guestId));
}

export function recordPublicRsvp(weddingId: string, input: PublicRsvpInput) {
  commit(applyPublicRsvp(snapshot, weddingId, input, new Date().toISOString()));
}
