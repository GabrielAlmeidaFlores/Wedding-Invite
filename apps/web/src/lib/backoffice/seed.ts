import { wedding } from '@/data/wedding';
import type { BackofficeState, GiftRecord, GuestRecord, WeddingRecord } from '@/lib/backoffice/types';

export const DEFAULT_WEDDING_ID = 'wedding-geisa-joao';

const ceremony = wedding.places[0];
const reception = wedding.places[1];

export const seedWedding: WeddingRecord = {
  id: DEFAULT_WEDDING_ID,
  slug: 'geisa-e-joao',
  bride: wedding.bride,
  groom: wedding.groom,
  siteTitle: wedding.siteTitle,
  dateTimeIso: wedding.dateTimeIso,
  photoUrl: wedding.heroImage,
  message: wedding.wedding.quote,
  quoteAuthor: wedding.wedding.quoteAuthor,
  closingLine: wedding.closing.line1,
  closingArtUrl: wedding.closing.art,
  closingArtDesktopUrl: wedding.closing.artDesktop,
  dressName: wedding.dressCode.name,
  dressText: wedding.dressCode.description.join('\n\n'),
  dressArtUrl: wedding.dressCode.art,
  dressArtAlign: wedding.dressCode.artAlign,
  albumArtUrl: wedding.album.art,
  logoUrl: wedding.logoUrl,
  envelopeUrl: wedding.hero.envelope,
  envelopeMobileUrl: wedding.hero.envelopeMobile,
  ceremony: {
    name: ceremony?.name ?? '',
    address: ceremony?.address ?? '',
    timeLabel: ceremony?.when ?? '',
    mapUrl: '',
  },
  reception: {
    name: reception?.name ?? '',
    address: reception?.address ?? '',
    timeLabel: reception?.when ?? '',
    mapUrl: '',
  },
  rsvpDeadline: '2028-04-20',
  updatedAt: '2026-09-23T12:00:00',
};

export const seedGifts: GiftRecord[] = wedding.gifts.items.map((item, index) => ({
  id: item.id,
  weddingId: DEFAULT_WEDDING_ID,
  name: item.name,
  description: '',
  imageUrl: item.image?.src ?? '',
  priceCents: item.priceCents ?? null,
  link: '',
  active: true,
  sortOrder: index,
}));

export const seedGuests: GuestRecord[] = [
  {
    id: 'guest-ana',
    weddingId: DEFAULT_WEDDING_ID,
    firstName: 'Ana',
    lastName: 'Souza',
    family: 'Família Souza',
    status: 'confirmed',
    confirmedAt: '2026-08-12T14:20:00',
    notes: '',
  },
  {
    id: 'guest-bruno',
    weddingId: DEFAULT_WEDDING_ID,
    firstName: 'Bruno',
    lastName: 'Souza',
    family: 'Família Souza',
    status: 'confirmed',
    confirmedAt: '2026-08-12T14:20:00',
    notes: '',
  },
  {
    id: 'guest-carla',
    weddingId: DEFAULT_WEDDING_ID,
    firstName: 'Carla',
    lastName: 'Mendes',
    family: 'Amigos da faculdade',
    status: 'pending',
    confirmedAt: null,
    notes: '',
  },
  {
    id: 'guest-diego',
    weddingId: DEFAULT_WEDDING_ID,
    firstName: 'Diego',
    lastName: 'Mendes',
    family: 'Amigos da faculdade',
    status: 'pending',
    confirmedAt: null,
    notes: '',
  },
  {
    id: 'guest-elena',
    weddingId: DEFAULT_WEDDING_ID,
    firstName: 'Elena',
    lastName: 'Ribeiro',
    family: 'Família Ribeiro',
    status: 'declined',
    confirmedAt: '2026-07-03T09:10:00',
    notes: 'Estaremos viajando na data.',
  },
  {
    id: 'guest-felipe',
    weddingId: DEFAULT_WEDDING_ID,
    firstName: 'Felipe',
    lastName: 'Costa',
    family: 'Trabalho',
    status: 'confirmed',
    confirmedAt: '2026-09-01T18:40:00',
    notes: '',
  },
  {
    id: 'guest-giulia',
    weddingId: DEFAULT_WEDDING_ID,
    firstName: 'Giulia',
    lastName: 'Costa',
    family: 'Trabalho',
    status: 'pending',
    confirmedAt: null,
    notes: '',
  },
  {
    id: 'guest-helena',
    weddingId: DEFAULT_WEDDING_ID,
    firstName: 'Helena',
    lastName: 'Cardoso',
    family: 'Família Cardoso',
    status: 'confirmed',
    confirmedAt: '2026-06-18T11:05:00',
    notes: '',
  },
];

export function createSeedState(): BackofficeState {
  return structuredClone({
    weddings: [seedWedding],
    gifts: seedGifts,
    guests: seedGuests,
  });
}
