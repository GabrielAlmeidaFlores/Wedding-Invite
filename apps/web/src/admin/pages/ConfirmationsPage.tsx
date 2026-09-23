import { formatDateTime, formatWeddingDate } from '@/lib/backoffice/dates';
import { guestFullName } from '@/lib/backoffice/names';
import { getWedding, listGuests } from '@/lib/backoffice/state';
import { computeGuestStats } from '@/lib/backoffice/stats';
import type { SessionUser } from '@/lib/backoffice/types';
import { StatusBadge } from '@/admin/components/StatusBadge';
import { useBackofficeStore } from '@/hooks/use-backoffice-store';

type ConfirmationsPageProps = {
  user: SessionUser;
};

export function ConfirmationsPage({ user }: ConfirmationsPageProps) {
  const snapshot = useBackofficeStore();
  const wedding = getWedding(snapshot, user.weddingId);
  const guests = listGuests(snapshot, user.weddingId)
    .filter((guest) => guest.status !== 'pending')
    .slice()
    .sort((a, b) => (b.confirmedAt ?? '').localeCompare(a.confirmedAt ?? ''));
  const stats = computeGuestStats(listGuests(snapshot, user.weddingId));

  return (
    <section>
      <h1 className="admin-page-title">Confirmações</h1>
      <p className="admin-lede">
        Respostas recebidas pelo site
        {wedding?.rsvpDeadline ? ` · prazo até ${formatWeddingDate(`${wedding.rsvpDeadline}T12:00:00`)}` : ''}.
      </p>
      <div className="admin-cards">
        <article className="admin-card">
          <span>Confirmados</span>
          <strong>{stats.confirmed}</strong>
        </article>
        <article className="admin-card">
          <span>Não vão</span>
          <strong>{stats.declined}</strong>
        </article>
      </div>
      {guests.length === 0 ? (
        <p className="admin-empty">Ainda não há respostas registradas.</p>
      ) : (
        <div className="admin-table-wrap admin-panel" style={{ marginTop: '1rem', padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Status</th>
                <th>Data</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id}>
                  <td>{guestFullName(guest)}</td>
                  <td>
                    <StatusBadge status={guest.status} />
                  </td>
                  <td>{guest.confirmedAt ? formatDateTime(guest.confirmedAt) : '—'}</td>
                  <td>{guest.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
