import { describe, expect, it } from 'vitest';
import { hasRsvpErrors, toRsvpPayload, validateRsvp, type RsvpDraft } from '@/lib/rsvp';

const valid: RsvpDraft = {
  fullName: 'Ana Souza',
  presence: 'yes',
  companions: 1,
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

  it('should ignore companions when the guest cannot attend', () => {
    expect(validateRsvp({ ...valid, presence: 'no', companions: -1 })).toEqual({});
  });

  it('should reject an out of range companion count', () => {
    expect(validateRsvp({ ...valid, companions: 11 }).companions).toBe(true);
  });
});

describe('toRsvpPayload', () => {
  it('should trim text and drop companions when the guest declines', () => {
    expect(toRsvpPayload({ ...valid, presence: 'no', companions: 4 })).toEqual({
      fullName: 'Ana Souza',
      presence: 'no',
      companions: 0,
    });
  });

  it('should return null when the draft is invalid', () => {
    expect(toRsvpPayload({ ...valid, fullName: ' ' })).toBeNull();
  });
});
