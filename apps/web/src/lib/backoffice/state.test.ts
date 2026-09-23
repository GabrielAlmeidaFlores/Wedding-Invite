import { describe, expect, it } from 'vitest';
import { wedding } from '@/data/wedding';
import { createSeedState, DEFAULT_WEDDING_ID } from '@/lib/backoffice/seed';
import {
  alignSiteContent,
  applyPublicRsvp,
  restoreContent,
  filterGuests,
  listGifts,
  moveGift,
  removeGuest,
  saveGuest,
} from '@/lib/backoffice/state';
import { computeGuestStats } from '@/lib/backoffice/stats';
import { canManageEvent, canManageGuests, canViewGuests } from '@/lib/backoffice/permissions';

describe('applyPublicRsvp', () => {
  it('should update an existing guest when the name matches', () => {
    const next = applyPublicRsvp(createSeedState(), DEFAULT_WEDDING_ID, {
      fullName: 'Carla Mendes',
      presence: 'yes',
      notes: '  chego um pouco atrasada  ',
    }, '2026-09-23T15:00:00');
    const guest = next.guests.find((item) => item.id === 'guest-carla');
    expect(guest?.status).toBe('confirmed');
    expect(guest?.notes).toBe('chego um pouco atrasada');
    expect(guest?.confirmedAt).toBe('2026-09-23T15:00:00');
  });

  it('should create a guest when the name is new', () => {
    const next = applyPublicRsvp(createSeedState(), DEFAULT_WEDDING_ID, {
      fullName: 'Marina Lopes',
      presence: 'no',
      notes: '',
    }, '2026-09-23T15:00:00');
    const created = next.guests.find((item) => item.firstName === 'Marina' && item.lastName === 'Lopes');
    expect(created?.status).toBe('declined');
    expect(created?.weddingId).toBe(DEFAULT_WEDDING_ID);
  });

  it('should keep another wedding isolated', () => {
    const seeded = createSeedState();
    const withOther = saveGuest(seeded, {
      id: 'guest-other',
      weddingId: 'wedding-other',
      firstName: 'Outro',
      lastName: 'Casal',
      family: '',
      status: 'pending',
      confirmedAt: null,
      notes: '',
    });
    const next = applyPublicRsvp(withOther, DEFAULT_WEDDING_ID, {
      fullName: 'Outro Casal',
      presence: 'yes',
      notes: '',
    }, '2026-09-23T15:00:00');
    expect(next.guests.find((item) => item.id === 'guest-other')?.status).toBe('pending');
  });
});

describe('filterGuests', () => {
  it('should filter by status and name', () => {
    const guests = createSeedState().guests;
    expect(filterGuests(guests, 'souza', 'confirmed')).toHaveLength(2);
    expect(filterGuests(guests, 'mendes', 'pending')).toHaveLength(2);
  });
});

describe('gift order', () => {
  it('should swap sort order with the neighbor', () => {
    const seeded = createSeedState();
    const first = listGifts(seeded, DEFAULT_WEDDING_ID)[0];
    const second = listGifts(seeded, DEFAULT_WEDDING_ID)[1];
    if (!first || !second) throw new Error('seed gifts');
    const next = moveGift(seeded, DEFAULT_WEDDING_ID, first.id, 1);
    const ordered = listGifts(next, DEFAULT_WEDDING_ID);
    expect(ordered[0]?.id).toBe(second.id);
    expect(ordered[1]?.id).toBe(first.id);
  });
});

describe('removeGuest', () => {
  it('should delete only the selected guest', () => {
    const next = removeGuest(createSeedState(), 'guest-ana');
    expect(next.guests.some((item) => item.id === 'guest-ana')).toBe(false);
    expect(next.guests.some((item) => item.id === 'guest-bruno')).toBe(true);
  });
});

describe('alignSiteContent', () => {
  it('should use the cover photo and the quote already shown on the site', () => {
    const seeded = createSeedState();
    const current = seeded.weddings[0];
    if (!current) throw new Error('missing wedding');
    const stored = {
      ...seeded,
      weddings: [
        {
          ...current,
          message: wedding.phrase,
          photoUrl: '/images/fotos/capa/bg-foto-principal.webp',
        },
      ],
    };
    const next = alignSiteContent(stored);
    expect(next.weddings[0]?.message).toBe(wedding.wedding.quote);
    expect(next.weddings[0]?.photoUrl).toBe('/images/fotos/capa/bg-foto-principal.png');
    expect(alignSiteContent(next)).toBe(next);
    const saved = next.weddings[0];
    if (!saved) throw new Error('missing wedding');
    const withoutArt = {
      ...next,
      weddings: [{ ...saved, closingArtUrl: '', closingArtDesktopUrl: '', siteTitle: '' }],
    };
    const aligned = alignSiteContent(withoutArt);
    expect(aligned.weddings[0]?.closingArtUrl).toBe('/images/elementos/recado.svg');
    expect(aligned.weddings[0]?.closingArtDesktopUrl).toBe('/images/elementos/recado-web.svg');
    expect(aligned.weddings[0]?.siteTitle).toBe('Geísa & João Gabriel');
    const tested = restoreContent(
      {
        ...aligned,
        weddings: [{ ...saved, message: 'Texto de teste', photoUrl: 'data:image/png;base64,abc' }],
        gifts: [],
      },
      createSeedState(),
    );
    expect(tested.weddings[0]?.message).toBe(wedding.wedding.quote);
    expect(tested.weddings[0]?.photoUrl).toBe('/images/fotos/capa/bg-foto-principal.png');
    expect(tested.weddings[0]?.quoteAuthor).toBe('Santo Agostinho');
    expect(tested.gifts).toHaveLength(createSeedState().gifts.length);
    expect(tested.guests).toBe(aligned.guests);
  });

  it('should drop a guest phone and email already stored', () => {
    const seeded = createSeedState();
    const guest = seeded.guests[0];
    if (!guest) throw new Error('missing guest');
    const legacy = {
      ...guest,
      phone: '15998881111',
      email: 'ana.souza@email.com',
      companionsAllowed: 2,
      companionsCount: 1,
    };
    const next = alignSiteContent({ ...seeded, guests: [legacy, ...seeded.guests.slice(1)] });
    expect(next.guests[0]).not.toHaveProperty('phone');
    expect(next.guests[0]).not.toHaveProperty('email');
    expect(next.guests[0]).not.toHaveProperty('companionsAllowed');
    expect(next.guests[0]).not.toHaveProperty('companionsCount');
    expect(next.guests[0]?.firstName).toBe(guest.firstName);
  });

  it('should fill the dress code when it was never saved', () => {
    const seeded = createSeedState();
    const current = seeded.weddings[0];
    if (!current) throw new Error('missing wedding');
    const {
      dressName: _dressName,
      dressText: _dressText,
      dressArtUrl: _dressArtUrl,
      dressArtAlign: _dressArtAlign,
      ...legacy
    } = current;
    const next = alignSiteContent({ ...seeded, weddings: [legacy as typeof current] });
    expect(next.weddings[0]?.dressName).toBe('Confortável e bonito');
    expect(next.weddings[0]?.dressText).toContain('Não teremos traje obrigatório');
    expect(next.weddings[0]?.dressArtUrl).toBe('/images/elementos/simba1.webp');
    expect(next.weddings[0]?.dressArtAlign).toBe('right');
  });

  it('should keep a known dress art side and correct an unknown one', () => {
    const seeded = createSeedState();
    const current = seeded.weddings[0];
    if (!current) throw new Error('missing wedding');
    const kept = alignSiteContent({
      ...seeded,
      weddings: [{ ...current, dressArtAlign: 'left' }],
    });
    expect(kept.weddings[0]?.dressArtAlign).toBe('left');
    const corrected = alignSiteContent({
      ...seeded,
      weddings: [{ ...current, dressArtAlign: 'top' as 'left' }],
    });
    expect(corrected.weddings[0]?.dressArtAlign).toBe('right');
  });

  it('should fill the album illustration when it was never saved', () => {
    const seeded = createSeedState();
    const current = seeded.weddings[0];
    if (!current) throw new Error('missing wedding');
    const { albumArtUrl: _albumArtUrl, ...legacy } = current;
    const next = alignSiteContent({ ...seeded, weddings: [legacy as typeof current] });
    expect(next.weddings[0]?.albumArtUrl).toBe('/images/elementos/simba2.webp');
  });

  it('should fill the navbar logo when it was never saved', () => {
    const seeded = createSeedState();
    const current = seeded.weddings[0];
    if (!current) throw new Error('missing wedding');
    const { logoUrl: _logoUrl, ...legacy } = current;
    const next = alignSiteContent({ ...seeded, weddings: [legacy as typeof current] });
    expect(next.weddings[0]?.logoUrl).toBe('/images/elementos/logo-principal.svg');
  });

  it('should fill the envelope art when it was never saved', () => {
    const seeded = createSeedState();
    const current = seeded.weddings[0];
    if (!current) throw new Error('missing wedding');
    const { envelopeUrl: _envelopeUrl, envelopeMobileUrl: _envelopeMobileUrl, ...legacy } = current;
    const next = alignSiteContent({ ...seeded, weddings: [legacy as typeof current] });
    expect(next.weddings[0]?.envelopeUrl).toBe('/images/elementos/convite.svg');
    expect(next.weddings[0]?.envelopeMobileUrl).toBe('/images/elementos/convite-mobile.webp');
  });
});

describe('computeGuestStats', () => {
  it('should count each registered guest once', () => {
    const stats = computeGuestStats(createSeedState().guests);
    expect(stats.total).toBe(8);
    expect(stats.confirmed).toBe(4);
    expect(stats.pending).toBe(3);
    expect(stats.declined).toBe(1);
    expect(stats.percent).toBe(50);
  });
});

describe('permissions', () => {
  it('should keep ceremonialists read-only on event data', () => {
    expect(canManageEvent('admin')).toBe(true);
    expect(canManageEvent('ceremonialist')).toBe(false);
    expect(canManageGuests('ceremonialist')).toBe(false);
    expect(canViewGuests('ceremonialist')).toBe(true);
  });
});
