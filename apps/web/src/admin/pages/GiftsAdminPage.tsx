import { useState } from 'react';
import { formatGiftPrice } from '@/lib/gift-price';
import { createBlankGift, listGifts } from '@/lib/backoffice/state';
import { deleteGift, reorderGift, upsertGift } from '@/lib/backoffice/store';
import type { Notify } from '@/admin/toast';
import type { GiftRecord, SessionUser } from '@/lib/backoffice/types';
import { readImageFile } from '@/admin/read-file';
import { useBackofficeStore } from '@/hooks/use-backoffice-store';
import { Button } from '@/components/Button';

type GiftsAdminPageProps = {
  user: SessionUser;
  notify: Notify;
};

export function GiftsAdminPage({ user, notify }: GiftsAdminPageProps) {
  const snapshot = useBackofficeStore();
  const gifts = listGifts(snapshot, user.weddingId);
  const [editing, setEditing] = useState<GiftRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<GiftRecord | null>(null);

  return (
    <section>
      <h1 className="admin-page-title">Catálogo</h1>
      <p className="admin-lede">Só os itens ativos aparecem no site dos noivos.</p>
      <div className="admin-toolbar">
        <Button type="button" onClick={() => setEditing(createBlankGift(user.weddingId, gifts.length))}>
          Criar presente
        </Button>
      </div>
      <div className="admin-panel">
        {gifts.length === 0 ? (
          <p className="admin-empty">Nenhum presente cadastrado ainda.</p>
        ) : (
          gifts.map((gift, index) => (
            <article className="admin-gift-row" key={gift.id}>
              {gift.imageUrl ? (
                <img className="admin-gift-thumb" src={gift.imageUrl} alt="" />
              ) : (
                <div className="admin-gift-thumb" />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{gift.name || 'Sem nome'}</strong>
                <p className="admin-muted">
                  {gift.priceCents === null ? 'Sem valor' : formatGiftPrice(gift.priceCents)} ·{' '}
                  {gift.active ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              <div className="admin-actions">
                <button type="button" className="linkish" onClick={() => reorderGift(user.weddingId, gift.id, -1)} disabled={index === 0}>
                  Subir
                </button>
                <button
                  type="button"
                  className="linkish"
                  onClick={() => reorderGift(user.weddingId, gift.id, 1)}
                  disabled={index === gifts.length - 1}
                >
                  Descer
                </button>
                <button
                  type="button"
                  className="linkish"
                  onClick={() => {
                    upsertGift({ ...gift, active: !gift.active });
                    notify(gift.active ? 'Presente desativado.' : 'Presente ativado.', 'success');
                  }}
                >
                  {gift.active ? 'Desativar' : 'Ativar'}
                </button>
                <button type="button" className="linkish" onClick={() => setEditing(gift)}>
                  Editar
                </button>
                <button type="button" className="linkish" onClick={() => setPendingDelete(gift)}>
                  Excluir
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {editing ? (
        <GiftEditor
          gift={editing}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            upsertGift(next);
            setEditing(null);
            notify('Presente salvo.', 'success');
          }}
        />
      ) : null}

      {pendingDelete ? (
        <div className="admin-overlay">
          <div className="admin-modal">
            <h2>Excluir presente?</h2>
            <p className="admin-lede">{pendingDelete.name} sairá do site e do catálogo.</p>
            <div className="admin-actions">
              <Button
                type="button"
                onClick={() => {
                  deleteGift(pendingDelete.id);
                  setPendingDelete(null);
                  notify('Presente excluído.', 'success');
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

type GiftEditorProps = {
  gift: GiftRecord;
  onClose: () => void;
  onSave: (gift: GiftRecord) => void;
};

function GiftEditor({ gift, onClose, onSave }: GiftEditorProps) {
  const [draft, setDraft] = useState(gift);
  const [price, setPrice] = useState(gift.priceCents === null ? '' : (gift.priceCents / 100).toFixed(2).replace('.', ','));

  return (
    <div className="admin-overlay">
      <form
        className="admin-modal admin-form"
        onSubmit={(event) => {
          event.preventDefault();
          const parsed = price.trim() ? Number(price.replace(/\./g, '').replace(',', '.')) : null;
          onSave({
            ...draft,
            name: draft.name.trim(),
            description: draft.description.trim(),
            link: draft.link.trim(),
            priceCents: parsed === null || Number.isNaN(parsed) ? null : Math.round(parsed * 100),
          });
        }}
      >
        <h2>{gift.name ? 'Editar presente' : 'Novo presente'}</h2>
        <div className="admin-field">
          <label htmlFor="gift-name">Nome</label>
          <input id="gift-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
        </div>
        <div className="admin-field">
          <label htmlFor="gift-desc">Descrição</label>
          <textarea
            id="gift-desc"
            rows={3}
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
          />
        </div>
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="gift-price">Valor</label>
            <input id="gift-price" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="189,00" />
          </div>
          <div className="admin-field">
            <label htmlFor="gift-link">Link ou ação</label>
            <input id="gift-link" value={draft.link} onChange={(event) => setDraft({ ...draft, link: event.target.value })} />
          </div>
        </div>
        <div className="admin-field">
          <label htmlFor="gift-image">Imagem</label>
          <input
            id="gift-image"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void readImageFile(file).then((imageUrl) => setDraft((current) => ({ ...current, imageUrl })));
            }}
          />
        </div>
        <label className="admin-muted">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(event) => setDraft({ ...draft, active: event.target.checked })}
          />{' '}
          Ativo no site
        </label>
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
