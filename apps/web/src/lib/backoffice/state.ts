import { wedding } from '@/data/wedding';
import { createId } from '@/lib/backoffice/ids';
import { findGuestByName, splitFullName } from '@/lib/backoffice/names';
import type {
  BackofficeState,
  GiftRecord,
  GuestFilter,
  GuestRecord,
  DressArtSide,
  PublicRsvpInput,
  WeddingRecord,
} from '@/lib/backoffice/types';

function byWedding<T extends { weddingId: string }>(items: readonly T[], weddingId: string): T[] {
  return items.filter((item) => item.weddingId === weddingId);
}

const PREVIOUS_COVER = '/images/fotos/capa/bg-foto-principal.webp';
const LEGACY_QUOTE = 'Entre todas as coisas deste mundo, o amor fez de nós um só coração.';

function dressArtSide(value: string | undefined): DressArtSide {
  if (value === 'left' || value === 'center' || value === 'right') return value;
  return 'right';
}

function coupleMessage(message: string): string {
  const text = message.trim();
  if (text === wedding.phrase || text === LEGACY_QUOTE) return wedding.wedding.quote;
  return message;
}

export function alignSiteContent(state: BackofficeState): BackofficeState {
  let changed = false;
  const weddings = state.weddings.map((item) => {
    const message = coupleMessage(item.message);
    const photoUrl =
      item.photoUrl.trim() === '' || item.photoUrl === PREVIOUS_COVER ? wedding.heroImage : item.photoUrl;
    const closingArtUrl = item.closingArtUrl?.trim() || wedding.closing.art;
    const closingArtDesktopUrl = item.closingArtDesktopUrl?.trim() || wedding.closing.artDesktop;
    const siteTitle = item.siteTitle?.trim() || wedding.siteTitle;
    const quoteAuthor = item.quoteAuthor?.trim() || wedding.wedding.quoteAuthor;
    const closingLine = item.closingLine?.trim() || wedding.closing.line1;
    const stored = item as WeddingRecord & {
      dressName?: string;
      dressText?: string;
      dressArtUrl?: string;
      dressArtAlign?: string;
      albumArtUrl?: string;
      logoUrl?: string;
      envelopeUrl?: string;
      envelopeMobileUrl?: string;
    };
    const dressName = stored.dressName?.trim() || wedding.dressCode.name;
    const dressText = stored.dressText?.trim() || wedding.dressCode.description.join('\n\n');
    const dressArtUrl = stored.dressArtUrl?.trim() || wedding.dressCode.art;
    const dressArtAlign = dressArtSide(stored.dressArtAlign);
    const albumArtUrl = stored.albumArtUrl?.trim() || wedding.album.art;
    const logoUrl = stored.logoUrl?.trim() || wedding.logoUrl;
    const envelopeUrl = stored.envelopeUrl?.trim() || wedding.hero.envelope;
    const envelopeMobileUrl = stored.envelopeMobileUrl?.trim() || wedding.hero.envelopeMobile;
    if (
      message === item.message &&
      photoUrl === item.photoUrl &&
      closingArtUrl === item.closingArtUrl &&
      closingArtDesktopUrl === item.closingArtDesktopUrl &&
      siteTitle === item.siteTitle &&
      quoteAuthor === item.quoteAuthor &&
      closingLine === item.closingLine &&
      dressName === item.dressName &&
      dressText === item.dressText &&
      dressArtUrl === item.dressArtUrl &&
      dressArtAlign === item.dressArtAlign &&
      albumArtUrl === item.albumArtUrl &&
      logoUrl === item.logoUrl &&
      envelopeUrl === item.envelopeUrl &&
      envelopeMobileUrl === item.envelopeMobileUrl
    ) {
      return item;
    }
    changed = true;
    return {
      ...item,
      message,
      photoUrl,
      closingArtUrl,
      closingArtDesktopUrl,
      siteTitle,
      quoteAuthor,
      closingLine,
      dressName,
      dressText,
      dressArtUrl,
      dressArtAlign,
      albumArtUrl,
      logoUrl,
      envelopeUrl,
      envelopeMobileUrl,
    };
  });
  let guestsChanged = false;
  const guests = state.guests.map((guest) => {
    const legacy = guest as GuestRecord & {
      phone?: string;
      email?: string;
      companionsAllowed?: number;
      companionsCount?: number;
    };
    if (
      !('phone' in legacy) &&
      !('email' in legacy) &&
      !('companionsAllowed' in legacy) &&
      !('companionsCount' in legacy)
    ) {
      return guest;
    }
    guestsChanged = true;
    const {
      phone: _phone,
      email: _email,
      companionsAllowed: _companionsAllowed,
      companionsCount: _companionsCount,
      ...rest
    } = legacy;
    return rest;
  });
  if (!changed && !guestsChanged) return state;
  return {
    ...state,
    weddings: changed ? weddings : state.weddings,
    guests: guestsChanged ? guests : state.guests,
  };
}

export function restoreContent(state: BackofficeState, seed: BackofficeState): BackofficeState {
  return {
    weddings: seed.weddings,
    gifts: seed.gifts,
    guests: state.guests,
  };
}

export function listWeddings(state: BackofficeState): WeddingRecord[] {
  return state.weddings;
}

export function getWedding(state: BackofficeState, weddingId: string): WeddingRecord | undefined {
  return state.weddings.find((item) => item.id === weddingId);
}

export function listGifts(state: BackofficeState, weddingId: string): GiftRecord[] {
  return byWedding(state.gifts, weddingId).slice().sort((a, b) => a.sortOrder - b.sortOrder);
}

export function listActiveGifts(state: BackofficeState, weddingId: string): GiftRecord[] {
  return listGifts(state, weddingId).filter((gift) => gift.active);
}

export function listGuests(state: BackofficeState, weddingId: string): GuestRecord[] {
  return byWedding(state.guests, weddingId);
}

export function filterGuests(
  guests: readonly GuestRecord[],
  query: string,
  status: GuestFilter,
): GuestRecord[] {
  const needle = query.trim().toLowerCase();
  return guests.filter((guest) => {
    if (status !== 'all' && guest.status !== status) return false;
    if (!needle) return true;
    const haystack = `${guest.firstName} ${guest.lastName} ${guest.family}`.toLowerCase();
    return haystack.includes(needle);
  });
}

export function updateWedding(
  state: BackofficeState,
  weddingId: string,
  patch: Partial<Omit<WeddingRecord, 'id' | 'slug'>>,
  nowIso: string,
): BackofficeState {
  return {
    ...state,
    weddings: state.weddings.map((wedding) =>
      wedding.id === weddingId ? { ...wedding, ...patch, updatedAt: nowIso } : wedding,
    ),
  };
}

export function saveGift(state: BackofficeState, gift: GiftRecord): BackofficeState {
  const exists = state.gifts.some((item) => item.id === gift.id);
  return {
    ...state,
    gifts: exists
      ? state.gifts.map((item) => (item.id === gift.id ? gift : item))
      : [...state.gifts, gift],
  };
}

export function removeGift(state: BackofficeState, giftId: string): BackofficeState {
  return { ...state, gifts: state.gifts.filter((item) => item.id !== giftId) };
}

export function moveGift(
  state: BackofficeState,
  weddingId: string,
  giftId: string,
  direction: -1 | 1,
): BackofficeState {
  const ordered = listGifts(state, weddingId);
  const index = ordered.findIndex((item) => item.id === giftId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= ordered.length) return state;

  const current = ordered[index];
  const neighbor = ordered[target];
  if (!current || !neighbor) return state;

  const nextOrder = new Map([
    [current.id, neighbor.sortOrder],
    [neighbor.id, current.sortOrder],
  ]);

  return {
    ...state,
    gifts: state.gifts.map((item) => {
      const sortOrder = nextOrder.get(item.id);
      return sortOrder === undefined ? item : { ...item, sortOrder };
    }),
  };
}

export function saveGuest(state: BackofficeState, guest: GuestRecord): BackofficeState {
  const exists = state.guests.some((item) => item.id === guest.id);
  return {
    ...state,
    guests: exists
      ? state.guests.map((item) => (item.id === guest.id ? guest : item))
      : [...state.guests, guest],
  };
}

export function removeGuest(state: BackofficeState, guestId: string): BackofficeState {
  return { ...state, guests: state.guests.filter((item) => item.id !== guestId) };
}

export function applyPublicRsvp(
  state: BackofficeState,
  weddingId: string,
  input: PublicRsvpInput,
  nowIso: string,
): BackofficeState {
  const guests = listGuests(state, weddingId);
  const existing = findGuestByName(guests, input.fullName);
  const names = splitFullName(input.fullName);
  const status = input.presence === 'yes' ? 'confirmed' : 'declined';
  const notes = input.notes.trim();

  if (existing) {
    return saveGuest(state, {
      ...existing,
      status,
      confirmedAt: nowIso,
      notes,
    });
  }

  return saveGuest(state, {
    id: createId('guest'),
    weddingId,
    firstName: names.firstName,
    lastName: names.lastName,
    family: '',
    status,
    confirmedAt: nowIso,
    notes,
  });
}

export function createBlankGift(weddingId: string, sortOrder: number): GiftRecord {
  return {
    id: createId('gift'),
    weddingId,
    name: '',
    description: '',
    imageUrl: '',
    priceCents: null,
    link: '',
    active: true,
    sortOrder,
  };
}

export function createBlankGuest(weddingId: string): GuestRecord {
  return {
    id: createId('guest'),
    weddingId,
    firstName: '',
    lastName: '',
    family: '',
    status: 'pending',
    confirmedAt: null,
    notes: '',
  };
}
