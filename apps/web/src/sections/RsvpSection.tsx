import { useState, type FormEvent } from 'react';
import {
  hasRsvpErrors,
  submitRsvp,
  toRsvpPayload,
  validateRsvp,
  type Presence,
  type RsvpErrors,
} from '@/lib/rsvp';
import { DEFAULT_WEDDING_ID } from '@/lib/backoffice/seed';
import { isDeadlinePassed } from '@/lib/backoffice/dates';
import { getWedding } from '@/lib/backoffice/state';
import { useBackofficeStore } from '@/hooks/use-backoffice-store';
import { useReveal } from '@/hooks/use-reveal';
import { useWeddingSite } from '@/hooks/use-wedding-site';
import { Button } from '@/components/Button';
import { SectionHeading } from '@/components/SectionHeading';

export function RsvpSection() {
  const ref = useReveal<HTMLElement>();
  const wedding = useWeddingSite();
  const snapshot = useBackofficeStore();
  const copy = wedding.rsvp;
  const record = getWedding(snapshot, DEFAULT_WEDDING_ID);
  const closed = isDeadlinePassed(record?.rsvpDeadline ?? null, new Date());
  const [fullName, setFullName] = useState('');
  const [presence, setPresence] = useState<Presence | ''>('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [confirmedPresence, setConfirmedPresence] = useState<Presence>('yes');

  const showErrors = submitted ? errors : {};

  const focusField = (field: 'fullName' | 'presence-yes') => {
    document.getElementById(field)?.focus();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const draft = { fullName, presence, notes };
    const nextErrors = validateRsvp(draft);
    setErrors(nextErrors);
    setSubmitted(true);
    if (hasRsvpErrors(nextErrors)) {
      if (nextErrors.fullName) focusField('fullName');
      else focusField('presence-yes');
      return;
    }

    const payload = toRsvpPayload(draft);
    if (!payload) return;

    setStatus('submitting');
    try {
      await submitRsvp(payload);
      setConfirmedPresence(payload.presence);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="section section-rsvp" id="rsvp" aria-labelledby="rsvp-title" ref={ref}>
      <div className="container container-form">
        <SectionHeading
          titleId="rsvp-title"
          eyebrow={copy.eyebrow}
          title={copy.title}
          lede={copy.lede}
          ornament="none"
        />
        {closed ? (
          <div className="rsvp-success" role="status">
            <p>O prazo para confirmar presença já encerrou. Qualquer dúvida, fale com os noivos.</p>
          </div>
        ) : status === 'success' ? (
          <div className="rsvp-success" role="status">
            <p>{confirmedPresence === 'yes' ? copy.successYes : copy.successNo}</p>
            <Button type="button" variant="ghost" onClick={() => setStatus('idle')}>
              {copy.edit}
            </Button>
          </div>
        ) : (
          <form className="rsvp-card" noValidate onSubmit={(event) => void onSubmit(event)}>
            <div className={showErrors.fullName ? 'field has-error' : 'field'}>
              <label htmlFor="fullName">{copy.nameLabel}</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder={copy.namePlaceholder}
                value={fullName}
                maxLength={120}
                aria-invalid={showErrors.fullName ? true : undefined}
                aria-describedby={showErrors.fullName ? 'fullName-error' : undefined}
                onChange={(event) => {
                  setFullName(event.target.value);
                  setErrors((current) => {
                    if (!current.fullName) return current;
                    const next = { ...current };
                    delete next.fullName;
                    return next;
                  });
                }}
              />
              {showErrors.fullName ? (
                <p id="fullName-error" className="field-error" role="alert">
                  {copy.errors.name}
                </p>
              ) : null}
            </div>

            <fieldset className={showErrors.presence ? 'has-error' : undefined}>
              <legend>{copy.presenceLabel}</legend>
              <div className="choices">
                <label className="choice">
                  <input
                    id="presence-yes"
                    type="radio"
                    name="presence"
                    value="yes"
                    checked={presence === 'yes'}
                    onChange={() => {
                      setPresence('yes');
                      setErrors((current) => {
                        if (!current.presence) return current;
                        const next = { ...current };
                        delete next.presence;
                        return next;
                      });
                    }}
                  />
                  <span>{copy.presenceYes}</span>
                </label>
                <label className="choice">
                  <input
                    type="radio"
                    name="presence"
                    value="no"
                    checked={presence === 'no'}
                    onChange={() => {
                      setPresence('no');
                      setErrors((current) => {
                        if (!current.presence) return current;
                        const next = { ...current };
                        delete next.presence;
                        return next;
                      });
                    }}
                  />
                  <span>{copy.presenceNo}</span>
                </label>
              </div>
              {showErrors.presence ? (
                <p className="field-error" role="alert">
                  {copy.errors.presence}
                </p>
              ) : null}
            </fieldset>

            <div className="field">
              <label htmlFor="notes">
                {copy.notesLabel} <span className="optional">opcional</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                maxLength={500}
                placeholder={copy.notesPlaceholder}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>

            {status === 'error' ? (
              <p className="field-error" role="alert">
                {copy.errors.submit}
              </p>
            ) : null}

            <Button type="submit" fullWidth disabled={status === 'submitting'}>
              {status === 'submitting' ? copy.submitting : copy.submit}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
