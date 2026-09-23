import { useMemo, useState } from 'react';
import { canManageGuests } from '@/lib/backoffice/permissions';
import { formatDateTime } from '@/lib/backoffice/dates';
import { guestFullName } from '@/lib/backoffice/names';
import { createBlankGuest, filterGuests, listGuests } from '@/lib/backoffice/state';
import { deleteGuest, upsertGuest } from '@/lib/backoffice/store';
import type { Notify } from '@/admin/toast';
import type { ConfirmationStatus, GuestFilter, GuestRecord, SessionUser } from '@/lib/backoffice/types';
import { StatusBadge } from '@/admin/components/StatusBadge';
import { useBackofficeStore } from '@/hooks/use-backoffice-store';
import { Button } from '@/components/Button';

type GuestsPageProps = {
  user: SessionUser;
  notify: Notify;
};

const FILTERS: { id: GuestFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'confirmed', label: 'Confirmados' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'declined', label: 'Não confirmados' },
];

export function GuestsPage({ user, notify }: GuestsPageProps) {
  const snapshot = useBackofficeStore();
  const guests = listGuests(snapshot, user.weddingId);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<GuestFilter>('all');
  const [editing, setEditing] = useState<GuestRecord | null>(null);
  const [viewing, setViewing] = useState<GuestRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<GuestRecord | null>(null);
  const canEdit = canManageGuests(user.role);

  const rows = useMemo(
    () =>
      filterGuests(guests, query, filter).slice().sort((a, b) => guestFullName(a).localeCompare(guestFullName(b), 'pt-BR')),
    [filter, guests, query],
  );

  return (
    <section>
      <h1 className="admin-page-title">Lista</h1>
      <p className="admin-lede">Pesquise, filtre e acompanhe o status de cada pessoa.</p>

      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Pesquisar por nome ou família"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {canEdit ? (
          <Button type="button" onClick={() => setEditing(createBlankGuest(user.weddingId))}>
            Adicionar convidado
          </Button>
        ) : null}
      </div>
      <div className="admin-filters">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={filter === item.id ? 'admin-chip is-active' : 'admin-chip'}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="admin-empty">Nenhum convidado encontrado com esse filtro.</p>
      ) : (
        <div className="admin-table-wrap admin-panel" style={{ marginTop: '1rem', padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Família</th>
                <th>Status</th>
                <th>Resposta</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((guest) => (
                <tr key={guest.id}>
                  <td>
                    {guest.firstName} {guest.lastName}
                  </td>
                  <td>{guest.family || '—'}</td>
                  <td>
                    <StatusBadge status={guest.status} />
                  </td>
                  <td>{guest.confirmedAt ? formatDateTime(guest.confirmedAt) : '—'}</td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="linkish" onClick={() => setViewing(guest)}>
                        Ver
                      </button>
                      {canEdit ? (
                        <>
                          <button type="button" className="linkish" onClick={() => setEditing(guest)}>
                            Editar
                          </button>
                          <button type="button" className="linkish" onClick={() => setPendingDelete(guest)}>
                            Excluir
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing ? (
        <div className="admin-overlay">
          <div className="admin-modal">
            <h2>{guestFullName(viewing)}</h2>
            <p className="admin-muted">Família: {viewing.family || '—'}</p>
            <p className="admin-muted">
              Status: <StatusBadge status={viewing.status} />
            </p>
            <p className="admin-muted">Resposta: {viewing.confirmedAt ? formatDateTime(viewing.confirmedAt) : '—'}</p>
            <p className="admin-muted">Observações: {viewing.notes || '—'}</p>
            <div style={{ marginTop: '1rem' }}>
              <Button type="button" variant="ghost" onClick={() => setViewing(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {editing ? (
        <GuestEditor
          guest={editing}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            upsertGuest(next);
            setEditing(null);
            notify('Convidado salvo.', 'success');
          }}
        />
      ) : null}

      {pendingDelete ? (
        <div className="admin-overlay">
          <div className="admin-modal">
            <h2>Excluir convidado?</h2>
            <p className="admin-lede">
              {guestFullName(pendingDelete)} será removido da lista deste casamento. Esta ação não pode ser desfeita.
            </p>
            <div className="admin-actions">
              <Button
                type="button"
                onClick={() => {
                  deleteGuest(pendingDelete.id);
                  setPendingDelete(null);
                  notify('Convidado excluído.', 'success');
                }}
              >
                Excluir
              </Button>
              <Button type="button" variant="ghost" onClick={() => setPendingDelete(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

type GuestEditorProps = {
  guest: GuestRecord;
  onClose: () => void;
  onSave: (guest: GuestRecord) => void;
};

function GuestEditor({ guest, onClose, onSave }: GuestEditorProps) {
  const [draft, setDraft] = useState(guest);

  return (
    <div className="admin-overlay">
      <form
        className="admin-modal admin-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            ...draft,
            firstName: draft.firstName.trim(),
            lastName: draft.lastName.trim(),
            family: draft.family.trim(),
            notes: draft.notes.trim(),
          });
        }}
      >
        <h2>{guest.firstName ? 'Editar convidado' : 'Novo convidado'}</h2>
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="guest-first">Nome</label>
            <input
              id="guest-first"
              value={draft.firstName}
              onChange={(event) => setDraft({ ...draft, firstName: event.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="guest-last">Sobrenome</label>
            <input
              id="guest-last"
              value={draft.lastName}
              onChange={(event) => setDraft({ ...draft, lastName: event.target.value })}
              required
            />
          </div>
        </div>
        <div className="admin-field">
          <label htmlFor="guest-family">Família ou grupo</label>
          <input
            id="guest-family"
            value={draft.family}
            onChange={(event) => setDraft({ ...draft, family: event.target.value })}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="guest-status">Status</label>
            <select
              id="guest-status"
              value={draft.status}
              onChange={(event) => setDraft({ ...draft, status: event.target.value as ConfirmationStatus })}
            >
              <option value="pending">Pendente</option>
              <option value="confirmed">Confirmado</option>
              <option value="declined">Não confirmou</option>
            </select>
        </div>
        <div className="admin-field">
          <label htmlFor="guest-notes">Observações</label>
          <textarea
            id="guest-notes"
            rows={3}
            value={draft.notes}
            onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
          />
        </div>
        <div className="admin-actions">
          <Button type="submit">Salvar</Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
