import { useState, type FormEvent } from 'react';
import { wedding } from '@/data/wedding';
import {
  hasRsvpErrors,
  submitRsvp,
  toRsvpPayload,
  validateRsvp,
  type Presence,
  type RsvpErrors,
} from '@/lib/rsvp';
import { useReveal } from '@/hooks/use-reveal';
import { Button } from '@/components/Button';
import { SectionHeading } from '@/components/SectionHeading';

const COMPANION_MAX = 10;

export function RsvpSection() {
  const ref = useReveal<HTMLElement>();
  const copy = wedding.rsvp;
  const [fullName, setFullName] = useState('');
  const [presence, setPresence] = useState<Presence | ''>('');
  const [companions, setCompanions] = useState(0);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [confirmedPresence, setConfirmedPresence] = useState<Presence>('yes');

  const showErrors = submitted ? errors : {};

  const focusField = (field: 'fullName' | 'presence-yes' | 'companions') => {
    document.getElementById(field)?.focus();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const draft = { fullName, presence, companions, notes };
    const nextErrors = validateRsvp(draft);
    setErrors(nextErrors);
    setSubmitted(true);
    if (hasRsvpErrors(nextErrors)) {
      if (nextErrors.fullName) focusField('fullName');
      else if (nextErrors.presence) focusField('presence-yes');
      else focusField('companions');
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

  const changeCompanions = (value: number) => {
    setCompanions(Math.min(COMPANION_MAX, Math.max(0, value)));
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
        {status === 'success' ? (
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

            {presence === 'yes' ? (
              <div className={showErrors.companions ? 'field has-error' : 'field'}>
                <label htmlFor="companions">{copy.companionsLabel}</label>
                <p className="field-hint" id="companions-hint">
                  {copy.companionsHint}
                </p>
                <div className="stepper">
                  <button
                    type="button"
                    aria-label="Diminuir acompanhantes"
                    onClick={() => changeCompanions(companions - 1)}
                    disabled={companions <= 0}
                  >
                    −
                  </button>
                  <input
                    id="companions"
                    name="companions"
                    inputMode="numeric"
                    value={companions}
                    aria-describedby="companions-hint"
                    onChange={(event) => {
                      const parsed = Number.parseInt(event.target.value, 10);
                      changeCompanions(Number.isNaN(parsed) ? 0 : parsed);
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Aumentar acompanhantes"
                    onClick={() => changeCompanions(companions + 1)}
                    disabled={companions >= COMPANION_MAX}
                  >
                    +
                  </button>
                </div>
                {showErrors.companions ? (
                  <p className="field-error" role="alert">
                    {copy.errors.companions}
                  </p>
                ) : null}
              </div>
            ) : null}

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
