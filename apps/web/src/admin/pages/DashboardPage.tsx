import { daysUntil, formatWeddingDate } from '@/lib/backoffice/dates';
import { getWedding, listGuests } from '@/lib/backoffice/state';
import { buildWeddingAlerts, computeGuestStats } from '@/lib/backoffice/stats';
import type { SessionUser } from '@/lib/backoffice/types';
import { useBackofficeStore } from '@/hooks/use-backoffice-store';

type DashboardPageProps = {
  user: SessionUser;
};

export function DashboardPage({ user }: DashboardPageProps) {
  const snapshot = useBackofficeStore();
  const wedding = getWedding(snapshot, user.weddingId);
  const guests = listGuests(snapshot, user.weddingId);
  const stats = computeGuestStats(guests);
  const now = new Date();
  const remaining = wedding ? daysUntil(wedding.dateTimeIso, now) : null;
  const alerts = wedding ? buildWeddingAlerts(wedding, stats, now) : [];

  return (
    <section>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-lede">
        {wedding ? `${wedding.bride} e ${wedding.groom}` : 'Casamento ainda sem nomes'}
        {wedding ? ` · ${formatWeddingDate(wedding.dateTimeIso)}` : ''}
      </p>

      <div className="admin-cards">
        <article className="admin-card">
          <span>Dias restantes</span>
          <strong>{remaining === null ? '—' : Math.max(0, remaining)}</strong>
          <em>{remaining !== null && remaining < 0 ? 'O dia já passou' : 'Até o casamento'}</em>
        </article>
        <article className="admin-card">
          <span>Convidados</span>
          <strong>{stats.total}</strong>
          <em>Cadastrados</em>
        </article>
        <article className="admin-card">
          <span>Confirmados</span>
          <strong>{stats.confirmed}</strong>
          <em>Responderam que vão</em>
        </article>
        <article className="admin-card">
          <span>Pendentes</span>
          <strong>{stats.pending}</strong>
          <em>Aguardando resposta</em>
        </article>
        <article className="admin-card">
          <span>Não confirmados</span>
          <strong>{stats.declined}</strong>
          <em>Avisaram que não vão</em>
        </article>
        <article className="admin-card">
          <span>Confirmação</span>
          <strong>{stats.percent}%</strong>
          <em>Da lista atual</em>
        </article>
      </div>

      <div className="admin-grid" style={{ marginTop: '1.1rem' }}>
        <section className="admin-panel">
          <h2>Convidados</h2>
          <p className="admin-muted">
            {stats.total} cadastrados · {stats.confirmed} confirmados · {stats.pending} pendentes · {stats.declined} não
            confirmados
          </p>
        </section>
        <section className="admin-panel admin-attention">
          <h2>Atenção</h2>
          {alerts.length === 0 ? (
            <p className="admin-muted">Nenhum alerta no momento. A lista está em dia.</p>
          ) : (
            <div className="admin-alerts">
              {alerts.map((alert) => (
                <article key={alert.id} className={alert.tone === 'info' ? 'admin-alert is-info' : 'admin-alert'}>
                  <strong>{alert.title}</strong>
                  <p>{alert.detail}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
