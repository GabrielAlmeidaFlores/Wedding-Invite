import { useState, type FormEvent } from 'react';
import { readImageFile } from '@/admin/read-file';
import { getWedding } from '@/lib/backoffice/state';
import { patchWedding } from '@/lib/backoffice/store';
import type { Notify } from '@/admin/toast';
import type { SessionUser } from '@/lib/backoffice/types';
import { useBackofficeStore } from '@/hooks/use-backoffice-store';
import { Button } from '@/components/Button';

type AlbumPageProps = {
  user: SessionUser;
  notify: Notify;
};

export function AlbumPage({ user, notify }: AlbumPageProps) {
  const snapshot = useBackofficeStore();
  const wedding = getWedding(snapshot, user.weddingId);
  const [artUrl, setArtUrl] = useState(wedding?.albumArtUrl ?? '');

  if (!wedding) return <p className="admin-empty">Casamento não encontrado.</p>;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    patchWedding(user.weddingId, { albumArtUrl: artUrl });
    notify('Álbum atualizado.', 'success');
  };

  return (
    <section>
      <h1 className="admin-page-title">Álbum</h1>
      <p className="admin-lede">A ilustração aparece ao lado das fotos no site.</p>
      <form className="admin-panel admin-form" onSubmit={onSubmit}>
        <fieldset className="admin-note-art">
          <legend>Arte</legend>
          <div className="admin-note-card">
            {artUrl ? <img className="admin-note-preview" src={artUrl} alt="" /> : null}
            <div className="admin-field">
              <label htmlFor="album-art">Ilustração</label>
              <input
                id="album-art"
                type="file"
                accept="image/svg+xml,image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  void readImageFile(file).then(setArtUrl);
                }}
              />
            </div>
          </div>
        </fieldset>
        <Button type="submit">Salvar</Button>
      </form>
    </section>
  );
}
