import { describe, expect, it } from 'vitest';
import { wedding } from '@/data/wedding';
import { formatClockLabel } from '@/lib/backoffice/dates';
import { mergePublicContent } from '@/lib/backoffice/public-content';
import { createSeedState } from '@/lib/backoffice/seed';
import type { GiftRecord } from '@/lib/backoffice/types';

describe('formatClockLabel', () => {
  it('should write an exact hour the way the site shows it', () => {
    expect(formatClockLabel('16:00')).toBe('às 16h');
    expect(formatClockLabel('09:00')).toBe('às 9h');
  });

  it('should keep the minutes when the hour is not exact', () => {
    expect(formatClockLabel('18:30')).toBe('às 18h30');
  });
});

describe('mergePublicContent', () => {
  it('should show the ceremony time from the wedding clock', () => {
    const record = createSeedState().weddings[0];
    if (!record) throw new Error('missing wedding');
    const content = mergePublicContent(
      wedding,
      {
        ...record,
        dateTimeIso: '2028-05-20T18:30:00',
        ceremony: { ...record.ceremony, timeLabel: 'às 16h' },
      },
      [],
    );
    expect(content.places[0]?.when).toBe('às 18h30');
    expect(content.dateTimeIso).toBe('2028-05-20T18:30:00');
  });

  it('should publish the dress code written in the backoffice', () => {
    const record = createSeedState().weddings[0];
    if (!record) throw new Error('missing wedding');
    const content = mergePublicContent(
      wedding,
      {
        ...record,
        dressName: 'Esporte fino',
        dressText: 'Venha de azul.\n\nSem pressa.',
        dressArtUrl: '/images/elementos/simba2.webp',
        dressArtAlign: 'center',
      },
      [],
    );
    expect(content.dressCode.name).toBe('Esporte fino');
    expect(content.dressCode.description).toEqual(['Venha de azul.', 'Sem pressa.']);
    expect(content.dressCode.art).toBe('/images/elementos/simba2.webp');
    expect(content.dressCode.artAlign).toBe('center');
  });

  it('should publish the closing line written in the backoffice', () => {
    const record = createSeedState().weddings[0];
    if (!record) throw new Error('missing wedding');
    const content = mergePublicContent(wedding, { ...record, closingLine: 'Obrigado por estarem aqui.' }, []);
    expect(content.closing.line1).toBe('Obrigado por estarem aqui.');
  });

  it('should publish the album illustration written in the backoffice', () => {
    const record = createSeedState().weddings[0];
    if (!record) throw new Error('missing wedding');
    const content = mergePublicContent(wedding, { ...record, albumArtUrl: '/images/elementos/simba2.png' }, []);
    expect(content.album.art).toBe('/images/elementos/simba2.png');
  });

  it('should publish the navbar logo written in the backoffice', () => {
    const record = createSeedState().weddings[0];
    if (!record) throw new Error('missing wedding');
    const content = mergePublicContent(wedding, { ...record, logoUrl: '/images/elementos/logo-enlace.svg' }, []);
    expect(content.logoUrl).toBe('/images/elementos/logo-enlace.svg');
  });

  it('should publish the envelope art written in the backoffice', () => {
    const record = createSeedState().weddings[0];
    if (!record) throw new Error('missing wedding');
    const content = mergePublicContent(
      wedding,
      {
        ...record,
        envelopeUrl: '/images/elementos/convite-mobile.webp',
        envelopeMobileUrl: '/images/elementos/convite.svg',
      },
      [],
    );
    expect(content.hero.envelope).toBe('/images/elementos/convite-mobile.webp');
    expect(content.hero.envelopeMobile).toBe('/images/elementos/convite.svg');
  });

  it('should publish only the active gifts written in the backoffice', () => {
    const record = createSeedState().weddings[0];
    if (!record) throw new Error('missing wedding');
    const gifts: GiftRecord[] = [
      {
        id: 'quadro',
        weddingId: record.id,
        name: 'Quadro',
        description: '  ',
        imageUrl: '',
        priceCents: null,
        link: '  ',
        active: true,
        sortOrder: 0,
      },
      {
        id: 'oculto',
        weddingId: record.id,
        name: 'Oculto',
        description: '',
        imageUrl: '',
        priceCents: 500,
        link: '',
        active: false,
        sortOrder: 1,
      },
      {
        id: 'cafeteira',
        weddingId: record.id,
        name: 'Cafeteira',
        description: 'Preta',
        imageUrl: '/c.png',
        priceCents: 1000,
        link: 'https://loja.test/c',
        active: true,
        sortOrder: 2,
      },
    ];
    const content = mergePublicContent(wedding, record, gifts);
    expect(content.gifts.items).toEqual([
      { id: 'quadro', name: 'Quadro' },
      {
        id: 'cafeteira',
        name: 'Cafeteira',
        description: 'Preta',
        priceCents: 1000,
        link: 'https://loja.test/c',
        image: { src: '/c.png', alt: 'Cafeteira' },
      },
    ]);
  });
});
