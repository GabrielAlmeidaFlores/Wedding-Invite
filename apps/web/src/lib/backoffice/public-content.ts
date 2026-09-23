import { formatClockLabel, formatWeddingDate, splitDateTime } from '@/lib/backoffice/dates';
import type { GiftRecord, WeddingRecord } from '@/lib/backoffice/types';
import type { GiftItem, WeddingContent } from '@/data/wedding';

export function toPublicGifts(gifts: readonly GiftRecord[]): GiftItem[] {
  return gifts
    .filter((gift) => gift.active)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((gift) => ({
      id: gift.id,
      name: gift.name,
      ...(gift.description.trim() ? { description: gift.description.trim() } : {}),
      ...(gift.priceCents === null ? {} : { priceCents: gift.priceCents }),
      ...(gift.link.trim() ? { link: gift.link.trim() } : {}),
      ...(gift.imageUrl ? { image: { src: gift.imageUrl, alt: gift.name } } : {}),
    }));
}

function dressParagraphs(text: string, fallback: readonly string[]): string[] {
  const parts = text
    .split('\n')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  return parts.length > 0 ? parts : [...fallback];
}

export function mergePublicContent(
  copy: WeddingContent,
  record: WeddingRecord | undefined,
  gifts: readonly GiftRecord[],
): WeddingContent {
  if (!record) return copy;

  const ceremony = copy.places[0];
  const reception = copy.places[1];

  return {
    ...copy,
    bride: record.bride || copy.bride,
    groom: record.groom || copy.groom,
    siteTitle: record.siteTitle || copy.siteTitle,
    phrase: record.message || copy.phrase,
    wedding: {
      ...copy.wedding,
      quote: record.message || copy.wedding.quote,
      quoteAuthor: record.quoteAuthor || copy.wedding.quoteAuthor,
    },
    dateTimeIso: record.dateTimeIso || copy.dateTimeIso,
    dateLabel: formatWeddingDate(record.dateTimeIso) || copy.dateLabel,
    heroImage: record.photoUrl || copy.heroImage,
    logoUrl: record.logoUrl || copy.logoUrl,
    hero: {
      ...copy.hero,
      envelope: record.envelopeUrl || copy.hero.envelope,
      envelopeMobile: record.envelopeMobileUrl || copy.hero.envelopeMobile,
    },
    places: [
      {
        id: ceremony?.id ?? 'cerimonia',
        label: ceremony?.label ?? 'Cerimônia',
        icon: ceremony?.icon ?? 'church',
        when:
          formatClockLabel(splitDateTime(record.dateTimeIso).time) ||
          record.ceremony.timeLabel ||
          ceremony?.when ||
          '',
        name: record.ceremony.name || ceremony?.name || '',
        address: record.ceremony.address || ceremony?.address || '',
        mapUrl: record.ceremony.mapUrl,
      },
      {
        id: reception?.id ?? 'recepcao',
        label: reception?.label ?? 'Recepção',
        icon: reception?.icon ?? 'cheers',
        when: record.reception.timeLabel || reception?.when || '',
        name: record.reception.name || reception?.name || '',
        address: record.reception.address || reception?.address || '',
        mapUrl: record.reception.mapUrl,
      },
    ],
    album: {
      ...copy.album,
      art: record.albumArtUrl || copy.album.art,
    },
    dressCode: {
      ...copy.dressCode,
      name: record.dressName || copy.dressCode.name,
      description: dressParagraphs(record.dressText, copy.dressCode.description),
      art: record.dressArtUrl || copy.dressCode.art,
      artAlign: record.dressArtAlign || copy.dressCode.artAlign,
    },
    gifts: {
      ...copy.gifts,
      items: toPublicGifts(gifts),
    },
    closing: {
      ...copy.closing,
      line1: record.closingLine || copy.closing.line1,
      art: record.closingArtUrl || copy.closing.art,
      artDesktop: record.closingArtDesktopUrl || copy.closing.artDesktop,
    },
  };
}
