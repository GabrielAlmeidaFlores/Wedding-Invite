export type Presence = 'yes' | 'no';

export type RsvpDraft = {
  fullName: string;
  presence: Presence | '';
  companions: number;
};

export type RsvpPayload = {
  fullName: string;
  presence: Presence;
  companions: number;
};

export type RsvpErrors = Partial<Record<'fullName' | 'presence' | 'companions', true>>;

export function validateRsvp(draft: RsvpDraft): RsvpErrors {
  const errors: RsvpErrors = {};
  if (draft.fullName.trim().length < 3) errors.fullName = true;
  if (draft.presence !== 'yes' && draft.presence !== 'no') errors.presence = true;
  if (
    draft.presence === 'yes' &&
    (!Number.isInteger(draft.companions) || draft.companions < 0 || draft.companions > 10)
  ) {
    errors.companions = true;
  }
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
    companions: draft.presence === 'yes' ? draft.companions : 0,
  };
}

/** Ponto de integração: substituir pelo envio real quando a API de RSVP existir. */
export async function submitRsvp(_payload: RsvpPayload): Promise<void> {
  await Promise.resolve();
}
