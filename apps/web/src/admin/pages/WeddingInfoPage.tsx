import { useState, type FormEvent } from 'react';
import { envelopeArt } from '@/data/wedding';
import { combineDateTime, formatClockLabel, splitDateTime } from '@/lib/backoffice/dates';
import { getWedding } from '@/lib/backoffice/state';
import { patchWedding } from '@/lib/backoffice/store';
import type { Notify } from '@/admin/toast';
import type { SessionUser } from '@/lib/backoffice/types';
import { readImageFile } from '@/admin/read-file';
import { useBackofficeStore } from '@/hooks/use-backoffice-store';
import { Button } from '@/components/Button';

type WeddingInfoPageProps = {
  user: SessionUser;
  notify: Notify;
};

type InfoTab = 'settings' | 'appearance';

export function WeddingInfoPage({ user, notify }: WeddingInfoPageProps) {
  const snapshot = useBackofficeStore();
  const wedding = getWedding(snapshot, user.weddingId);
  const parts = splitDateTime(wedding?.dateTimeIso ?? '');
  const [siteTitle, setSiteTitle] = useState(wedding?.siteTitle ?? '');
  const [bride, setBride] = useState(wedding?.bride ?? '');
  const [groom, setGroom] = useState(wedding?.groom ?? '');
  const [date, setDate] = useState(parts.date);
  const [time, setTime] = useState(parts.time);
  const [message, setMessage] = useState(wedding?.message ?? '');
  const [photoUrl, setPhotoUrl] = useState(wedding?.photoUrl ?? '');
  const [logoUrl, setLogoUrl] = useState(wedding?.logoUrl ?? '');
  const [envelopeUrl, setEnvelopeUrl] = useState(wedding?.envelopeUrl ?? '');
  const [envelopeMobileUrl, setEnvelopeMobileUrl] = useState(wedding?.envelopeMobileUrl ?? '');
  const [closingLine, setClosingLine] = useState(wedding?.closingLine ?? '');
  const [closingArtUrl, setClosingArtUrl] = useState(wedding?.closingArtUrl ?? '');
  const [closingArtDesktopUrl, setClosingArtDesktopUrl] = useState(wedding?.closingArtDesktopUrl ?? '');
  const [tab, setTab] = useState<InfoTab>('settings');
  const [saving, setSaving] = useState(false);

  if (!wedding) return <p className="admin-empty">Casamento não encontrado.</p>;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!siteTitle.trim() || !bride.trim() || !groom.trim() || !date || !time) {
      setTab('settings');
      notify('Preencha as configurações do casamento.', 'warning');
      return;
    }
    setSaving(true);
    patchWedding(user.weddingId, {
      siteTitle: siteTitle.trim(),
      bride: bride.trim(),
      groom: groom.trim(),
      dateTimeIso: combineDateTime(date, time),
      ceremony: { ...wedding.ceremony, timeLabel: formatClockLabel(time) },
      message: message.trim(),
      photoUrl,
      logoUrl,
      envelopeUrl,
      envelopeMobileUrl,
      closingLine: closingLine.trim(),
      closingArtUrl,
      closingArtDesktopUrl,
    });
    setSaving(false);
    notify('Informações do casamento salvas.', 'success');
  };

  return (
    <section>
      <h1 className="admin-page-title">Informações</h1>
      <p className="admin-lede">Esses dados alimentam automaticamente o site dos noivos.</p>
      <div className="admin-tabs" role="tablist" aria-label="Informações do casamento">
        <button type="button" role="tab" id="tab-settings" aria-controls="panel-settings" aria-selected={tab === 'settings'} onClick={() => setTab('settings')}>
          Configurações
        </button>
        <button type="button" role="tab" id="tab-appearance" aria-controls="panel-appearance" aria-selected={tab === 'appearance'} onClick={() => setTab('appearance')}>
          Personalização
        </button>
      </div>
      <form className="admin-panel admin-form" onSubmit={onSubmit}>
        <div role="tabpanel" id="panel-settings" aria-labelledby="tab-settings" hidden={tab !== 'settings'} className="admin-tab-panel">
        <div className="admin-field">
          <label htmlFor="site-title">Título da aba do site</label>
          <input
            id="site-title"
            value={siteTitle}
            onChange={(event) => setSiteTitle(event.target.value)}
            required
          />
        </div>
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="bride">Nome da noiva</label>
            <input id="bride" value={bride} onChange={(event) => setBride(event.target.value)} required />
          </div>
          <div className="admin-field">
            <label htmlFor="groom">Nome do noivo</label>
            <input id="groom" value={groom} onChange={(event) => setGroom(event.target.value)} required />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="wedding-date">Data</label>
            <input id="wedding-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          </div>
          <div className="admin-field">
            <label htmlFor="wedding-time">Horário</label>
            <input id="wedding-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} required />
          </div>
        </div>
        </div>
        <div role="tabpanel" id="panel-appearance" aria-labelledby="tab-appearance" hidden={tab !== 'appearance'} className="admin-tab-panel">
        <div className="admin-field">
          <label htmlFor="message">Mensagem do casal</label>
          <textarea id="message" rows={4} value={message} onChange={(event) => setMessage(event.target.value)} />
        </div>
        <fieldset className="admin-note-art">
          <legend>Logo da navegação</legend>
          <div className="admin-note-card">
            {logoUrl ? <img className="admin-note-preview" src={logoUrl} alt="" /> : null}
            <div className="admin-field">
              <label htmlFor="logo">Imagem</label>
              <input
                id="logo"
                type="file"
                accept="image/svg+xml,image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  void readImageFile(file).then(setLogoUrl);
                }}
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="admin-note-art">
          <legend>Arte de Entrada</legend>
          <div className="admin-form-row">
            <div className="admin-note-card">
              {envelopeMobileUrl ? <img className="admin-note-preview" src={envelopeMobileUrl} alt="" /> : null}
              <div className="admin-field">
                <label htmlFor="envelope-mobile">Celular</label>
                <p className="admin-muted">
                  {envelopeArt.mobile.width} × {envelopeArt.mobile.height} px
                </p>
                <input
                  id="envelope-mobile"
                  type="file"
                  accept="image/svg+xml,image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    void readImageFile(file).then(setEnvelopeMobileUrl);
                  }}
                />
              </div>
            </div>
            <div className="admin-note-card">
              {envelopeUrl ? <img className="admin-note-preview" src={envelopeUrl} alt="" /> : null}
              <div className="admin-field">
                <label htmlFor="envelope-desktop">Computador</label>
                <p className="admin-muted">
                  {envelopeArt.desktop.width} × {envelopeArt.desktop.height} px
                </p>
                <input
                  id="envelope-desktop"
                  type="file"
                  accept="image/svg+xml,image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    void readImageFile(file).then(setEnvelopeUrl);
                  }}
                />
              </div>
            </div>
          </div>
        </fieldset>
        <div className="admin-field">
          <label htmlFor="photo">Foto dos noivos</label>
          {photoUrl ? <img className="admin-photo-preview" src={photoUrl} alt="" /> : null}
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void readImageFile(file).then(setPhotoUrl);
            }}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="closing-line">Frase do rodapé</label>
          <textarea
            id="closing-line"
            rows={3}
            value={closingLine}
            onChange={(event) => setClosingLine(event.target.value)}
            required
          />
        </div>
        <fieldset className="admin-note-art">
          <legend>Arte de recado</legend>
          <div className="admin-form-row">
            <div className="admin-note-card">
              {closingArtUrl ? <img className="admin-note-preview" src={closingArtUrl} alt="" /> : null}
              <div className="admin-field">
                <label htmlFor="closing-art">Celular</label>
                <input
                  id="closing-art"
                  type="file"
                  accept="image/svg+xml,image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    void readImageFile(file).then(setClosingArtUrl);
                  }}
                />
              </div>
            </div>
            <div className="admin-note-card">
              {closingArtDesktopUrl ? (
                <img className="admin-note-preview" src={closingArtDesktopUrl} alt="" />
              ) : null}
              <div className="admin-field">
                <label htmlFor="closing-art-desktop">Computador</label>
                <input
                  id="closing-art-desktop"
                  type="file"
                  accept="image/svg+xml,image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    void readImageFile(file).then(setClosingArtDesktopUrl);
                  }}
                />
              </div>
            </div>
          </div>
        </fieldset>
        </div>
        <Button type="submit" disabled={saving}>
          Salvar informações
        </Button>
      </form>
    </section>
  );
}
