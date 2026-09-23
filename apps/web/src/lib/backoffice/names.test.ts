import { describe, expect, it } from 'vitest';
import { findGuestByName, normalizePersonName, splitFullName } from '@/lib/backoffice/names';
import { seedGuests } from '@/lib/backoffice/seed';

describe('normalizePersonName', () => {
  it('should ignore accents, case and extra spaces', () => {
    expect(normalizePersonName('  Ana   Souza ')).toBe('ana souza');
    expect(normalizePersonName('Geísa Vitória')).toBe('geisa vitoria');
  });
});

describe('splitFullName', () => {
  it('should keep the remainder as last name', () => {
    expect(splitFullName('Ana Souza Silva')).toEqual({ firstName: 'Ana', lastName: 'Souza Silva' });
  });
});

describe('findGuestByName', () => {
  it('should match a seeded guest ignoring accents', () => {
    expect(findGuestByName(seedGuests, 'ana souza')?.id).toBe('guest-ana');
  });
});
