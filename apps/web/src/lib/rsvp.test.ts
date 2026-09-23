import { describe, expect, it } from 'vitest';
import { hasRsvpErrors, toRsvpPayload, validateRsvp, type RsvpDraft } from '@/lib/rsvp';

const valid: RsvpDraft = {
  fullName: 'Ana Souza',
  presence: 'yes',
  notes: '  mesa perto da família  ',
};

describe('validateRsvp', () => {
  it('should accept a complete confirmation', () => {
    expect(hasRsvpErrors(validateRsvp(valid))).toBe(false);
  });

  it('should require the full name and the presence answer', () => {
    expect(validateRsvp({ ...valid, fullName: 'A', presence: '' })).toEqual({
      fullName: true,
      presence: true,
    });
  });

  it('should accept a decline without extra guests', () => {
    expect(validateRsvp({ ...valid, presence: 'no' })).toEqual({});
  });
});

describe('toRsvpPayload', () => {
  it('should trim the name and the notes', () => {
    expect(toRsvpPayload({ ...valid, presence: 'no' })).toEqual({
      fullName: 'Ana Souza',
      presence: 'no',
      notes: 'mesa perto da família',
    });
  });

  it('should return null when the draft is invalid', () => {
    expect(toRsvpPayload({ ...valid, fullName: ' ' })).toBeNull();
  });
});
