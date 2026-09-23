import { useState, type FormEvent } from 'react';
import { readImageFile } from '@/admin/read-file';
import { getWedding } from '@/lib/backoffice/state';
import { patchWedding } from '@/lib/backoffice/store';
import type { Notify } from '@/admin/toast';
import type { DressArtSide, SessionUser } from '@/lib/backoffice/types';
import { useBackofficeStore } from '@/hooks/use-backoffice-store';
import { Button } from '@/components/Button';

type DressPageProps = {
  user: SessionUser;
  notify: Notify;
};

export function DressPage({ user, notify }: DressPageProps) {
  const snapshot = useBackofficeStore();
  const wedding = getWedding(snapshot, user.weddingId);
  const [name, setName] = useState(wedding?.dressName ?? '');
  const [text, setText] = useState(wedding?.dressText ?? '');
  const [artUrl, setArtUrl] = useState(wedding?.dressArtUrl ?? '');
  const [artAlign, setArtAlign] = useState<DressArtSide>(wedding?.dressArtAlign ?? 'right');

  if (!wedding) return <p className="admin-empty">Casamento não encontrado.</p>;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    patchWedding(user.weddingId, {
      dressName: name.trim(),
      dressText: text.trim(),
      dressArtUrl: artUrl,
      dressArtAlign: artAlign,
    });
    notify('Traje atualizado.', 'success');
  };

  return (
    <section>
      <h1 className="admin-page-title">O que vestir</h1>
      <p className="admin-lede">O tipo, o texto e a ilustração aparecem na seção do site.</p>
      <form className="admin-panel admin-form" onSubmit={onSubmit}>
        <div className="admin-field">
          <label htmlFor="dress-name">Tipo do traje</label>
          <input id="dress-name" value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
        <div className="admin-field">
          <label htmlFor="dress-text">Texto</label>
          <textarea id="dress-text" rows={6} value={text} onChange={(event) => setText(event.target.value)} required />
        </div>
        <fieldset className="admin-note-art">
          <legend>Arte</legend>
          <div className="admin-note-card">
            {artUrl ? <img className="admin-note-preview" src={artUrl} alt="" /> : null}
            <div className="admin-field">
              <label htmlFor="dress-art">Ilustração</label>
              <input
                id="dress-art"
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
          <fieldset className="admin-choices">
            <legend>Posição</legend>
            {(
              [
                ['left', 'Esquerda'],
                ['center', 'Meio'],
                ['right', 'Direita'],
              ] as const
            ).map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="dress-art-align"
                  value={value}
                  checked={artAlign === value}
                  onChange={() => setArtAlign(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>
        </fieldset>
        <Button type="submit">Salvar</Button>
      </form>
    </section>
  );
}
