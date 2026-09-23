import { useState, type FormEvent } from 'react';
import { seedWedding } from '@/lib/backoffice/seed';
import { getWedding } from '@/lib/backoffice/state';
import { patchWedding, restoreOriginalContent } from '@/lib/backoffice/store';
import type { Notify } from '@/admin/toast';
import type { SessionUser } from '@/lib/backoffice/types';
import { useBackofficeStore } from '@/hooks/use-backoffice-store';
import { Button } from '@/components/Button';

type SettingsPageProps = {
  user: SessionUser;
  notify: Notify;
};

export function SettingsPage({ user, notify }: SettingsPageProps) {
  const snapshot = useBackofficeStore();
  const wedding = getWedding(snapshot, user.weddingId);
  const [deadline, setDeadline] = useState(wedding?.rsvpDeadline ?? '');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!wedding) return <p className="admin-empty">Casamento não encontrado.</p>;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    patchWedding(user.weddingId, { rsvpDeadline: deadline.trim() || null });
    notify('Configurações salvas.', 'success');
  };

  return (
    <section>
      <h1 className="admin-page-title">Configurações</h1>
      <p className="admin-lede">O prazo vale para o site público e para os alertas do dashboard.</p>
      <form className="admin-panel admin-form" onSubmit={onSubmit}>
        <div className="admin-field">
          <label htmlFor="rsvp-deadline">Data limite para confirmação</label>
          <input id="rsvp-deadline" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
        </div>
        <Button type="submit">Salvar configurações</Button>
      </form>
      <section className="admin-panel" style={{ marginTop: '1rem' }}>
        <h2>Conteúdo original</h2>
        <p className="admin-muted">
          Os textos e as imagens do convite ficam guardados no projeto. Use isto depois de testar uma
          personalização para voltar ao conteúdo certo. A lista de convidados permanece.
        </p>
        <div style={{ marginTop: '0.85rem' }}>
          <Button type="button" variant="ghost" onClick={() => setConfirmReset(true)}>
            Restaurar textos e imagens
          </Button>
        </div>
      </section>
      {confirmReset ? (
        <div className="admin-overlay">
          <div className="admin-modal">
            <h2>Restaurar o conteúdo original?</h2>
            <p className="admin-lede">
              Nomes, data, horário, mensagem, logo, arte de entrada, foto, traje, álbum, frase do rodapé, arte de recado e lista de presentes voltam ao que está no
              convite. As confirmações já recebidas continuam na lista.
            </p>
            <div className="admin-actions">
              <Button
                type="button"
                onClick={() => {
                  restoreOriginalContent();
                  setDeadline(seedWedding.rsvpDeadline ?? '');
                  setConfirmReset(false);
                  notify('Textos e imagens originais restaurados.', 'success');
                }}
              >
                Restaurar
              </Button>
              <Button type="button" variant="ghost" onClick={() => setConfirmReset(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
