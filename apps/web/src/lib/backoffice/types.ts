export type UserRole = 'admin' | 'ceremonialist';

export type DressArtSide = 'left' | 'center' | 'right';

export type ConfirmationStatus = 'pending' | 'confirmed' | 'declined';

export type WeddingPlaceConfig = {
  name: string;
  address: string;
  timeLabel: string;
  mapUrl: string;
};

export type WeddingRecord = {
  id: string;
  slug: string;
  bride: string;
  groom: string;
  siteTitle: string;
  dateTimeIso: string;
  photoUrl: string;
  message: string;
  quoteAuthor: string;
  closingLine: string;
  closingArtUrl: string;
  closingArtDesktopUrl: string;
  dressName: string;
  dressText: string;
  dressArtUrl: string;
  dressArtAlign: DressArtSide;
  albumArtUrl: string;
  logoUrl: string;
  envelopeUrl: string;
  envelopeMobileUrl: string;
  ceremony: WeddingPlaceConfig;
  reception: WeddingPlaceConfig;
  rsvpDeadline: string | null;
  updatedAt: string;
};

export type GiftRecord = {
  id: string;
  weddingId: string;
  name: string;
  description: string;
  imageUrl: string;
  priceCents: number | null;
  link: string;
  active: boolean;
  sortOrder: number;
};

export type GuestRecord = {
  id: string;
  weddingId: string;
  firstName: string;
  lastName: string;
  family: string;
  status: ConfirmationStatus;
  confirmedAt: string | null;
  notes: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  weddingId: string;
};

export type GuestFilter = 'all' | 'confirmed' | 'pending' | 'declined';

export type GuestStats = {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
  percent: number;
};

export type WeddingAlert = {
  id: string;
  tone: 'warn' | 'info';
  title: string;
  detail: string;
};

export type BackofficeState = {
  weddings: WeddingRecord[];
  gifts: GiftRecord[];
  guests: GuestRecord[];
};

export type PublicRsvpInput = {
  fullName: string;
  presence: 'yes' | 'no';
  notes: string;
};
