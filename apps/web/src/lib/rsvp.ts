import { DEFAULT_WEDDING_ID } from '@/lib/backoffice/seed';
import { recordPublicRsvp } from '@/lib/backoffice/store';

export type Presence = 'yes' | 'no';

export type RsvpDraft = {
  fullName: string;
  presence: Presence | '';
  notes: string;
};

export type RsvpPayload = {
  fullName: string;
  presence: Presence;
  notes: string;
};

export type RsvpErrors = Partial<Record<'fullName' | 'presence', true>>;

export function validateRsvp(draft: RsvpDraft): RsvpErrors {
  const errors: RsvpErrors = {};
  if (draft.fullName.trim().length < 3) errors.fullName = true;
  if (draft.presence !== 'yes' && draft.presence !== 'no') errors.presence = true;
  return errors;
}

export function hasRsvpErrors(errors: RsvpErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function toRsvpPayload(draft: RsvpDraft): RsvpPayload | null {
  if (hasRsvpErrors(validateRsvp(draft))) return null;
  if (draft.presence !== 'yes' && draft.presence !== 'no') return null;
  return {
    fullName: draft.fullName.trim(),
    presence: draft.presence,
    notes: draft.notes.trim(),
  };
}

export async function submitRsvp(payload: RsvpPayload): Promise<void> {
  recordPublicRsvp(DEFAULT_WEDDING_ID, payload);
  await Promise.resolve();
}
