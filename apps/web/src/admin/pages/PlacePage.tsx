import { useState, type FormEvent } from 'react';
import { combineDateTime, formatClockLabel, splitDateTime } from '@/lib/backoffice/dates';
import { getWedding } from '@/lib/backoffice/state';
import { patchWedding } from '@/lib/backoffice/store';
import type { Notify } from '@/admin/toast';
import type { SessionUser, WeddingPlaceConfig } from '@/lib/backoffice/types';
import { useBackofficeStore } from '@/hooks/use-backoffice-store';
import { Button } from '@/components/Button';

type PlacePageProps = {
  kind: 'ceremony' | 'reception';
  user: SessionUser;
  notify: Notify;
};

export function PlacePage({ kind, user, notify }: PlacePageProps) {
  const snapshot = useBackofficeStore();
  const wedding = getWedding(snapshot, user.weddingId);
  const current = kind === 'ceremony' ? wedding?.ceremony : wedding?.reception;
  const [place, setPlace] = useState<WeddingPlaceConfig>(
    current ?? { name: '', address: '', timeLabel: '', mapUrl: '' },
  );
  const [ceremonyTime, setCeremonyTime] = useState(splitDateTime(wedding?.dateTimeIso ?? '').time);

  if (!wedding) return <p className="admin-empty">Casamento não encontrado.</p>;

  const title = kind === 'ceremony' ? 'Cerimônia' : 'Festa';

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (kind === 'ceremony') {
      patchWedding(user.weddingId, {
        dateTimeIso: combineDateTime(splitDateTime(wedding.dateTimeIso).date, ceremonyTime),
        ceremony: { ...place, timeLabel: formatClockLabel(ceremonyTime) },
      });
    } else {
      patchWedding(user.weddingId, { reception: place });
    }
    notify(`${title} atualizada.`, 'success');
  };

  return (
    <section>
      <h1 className="admin-page-title">{title}</h1>
      <p className="admin-lede">O endereço e o horário passam a aparecer no site público.</p>
      <form className="admin-panel admin-form" onSubmit={onSubmit}>
        <div className="admin-field">
          <label htmlFor={`${kind}-name`}>Nome do local</label>
          <input
            id={`${kind}-name`}
            value={place.name}
            onChange={(event) => setPlace({ ...place, name: event.target.value })}
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor={`${kind}-address`}>Endereço</label>
          <input
            id={`${kind}-address`}
            value={place.address}
            onChange={(event) => setPlace({ ...place, address: event.target.value })}
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor={`${kind}-time`}>Horário</label>
          {kind === 'ceremony' ? (
            <input
              id={`${kind}-time`}
              type="time"
              value={ceremonyTime}
              onChange={(event) => setCeremonyTime(event.target.value)}
              required
            />
          ) : (
            <input
              id={`${kind}-time`}
              value={place.timeLabel}
              onChange={(event) => setPlace({ ...place, timeLabel: event.target.value })}
              placeholder="Logo após a cerimônia"
            />
          )}
        </div>
        <div className="admin-field">
          <label htmlFor={`${kind}-map`}>Link do mapa</label>
          <input
            id={`${kind}-map`}
            value={place.mapUrl}
            onChange={(event) => setPlace({ ...place, mapUrl: event.target.value })}
            placeholder="https://maps.google.com/..."
          />
        </div>
        <Button type="submit">Salvar {title.toLowerCase()}</Button>
      </form>
    </section>
  );
}
