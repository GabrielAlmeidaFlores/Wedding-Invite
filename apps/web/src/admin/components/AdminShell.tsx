import { useEffect, useState, type ReactNode } from 'react';
import { canManageEvent, canManageGifts } from '@/lib/backoffice/permissions';
import { roleLabel } from '@/lib/backoffice/auth';
import type { SessionUser } from '@/lib/backoffice/types';
import { AdminLink } from '@/admin/components/AdminLink';
import { Icon } from '@/components/Icon';
import { adminRoutes, breadcrumbsFor } from '@/admin/navigate';
import type { AdminToast } from '@/admin/toast';

type AdminShellProps = {
  user: SessionUser;
  path: string;
  toast: AdminToast | null;
  onSignOut: () => void;
  children: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
};

type NavGroupProps = {
  id: string;
  label: string;
  path: string;
  items: readonly NavItem[];
};

function NavGroup({ id, label, path, items }: NavGroupProps) {
  const containsPath = items.some((item) => item.href === path);
  const [open, setOpen] = useState(containsPath);
  const panelId = `admin-nav-${id}`;

  useEffect(() => {
    if (containsPath) setOpen(true);
  }, [containsPath]);

  return (
    <div className="admin-nav-group">
      <button
        className={containsPath ? 'admin-nav-toggle is-current' : 'admin-nav-toggle'}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        {label}
      </button>
      <div className="admin-nav-sub" id={panelId} hidden={!open}>
        {items.map((item) => (
          <AdminLink key={item.href} href={item.href} className={path === item.href ? 'is-active' : undefined}>
            {item.label}
          </AdminLink>
        ))}
      </div>
    </div>
  );
}

export function AdminShell({ user, path, toast, onSignOut, children }: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <div className="admin-shell">
      <aside className={menuOpen ? 'admin-sidebar is-drawer' : 'admin-sidebar'}>
        <AdminLink href={adminRoutes.dashboard} className="admin-brand">
          <img src="/images/elementos/logo-enlace.svg" alt="Enlace" />
        </AdminLink>
        <nav
          className="admin-nav"
          aria-label="Backoffice"
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest('a')) close();
          }}
        >
          <AdminLink
            href={adminRoutes.dashboard}
            className={path === adminRoutes.dashboard ? 'is-active' : undefined}
          >
            Dashboard
          </AdminLink>
          {canManageEvent(user.role) ? (
            <NavGroup
              id="wedding"
              label="Casamento"
              path={path}
              items={[
                { href: adminRoutes.wedding, label: 'Informações' },
                { href: adminRoutes.ceremony, label: 'Cerimônia' },
                { href: adminRoutes.reception, label: 'Festa' },
                { href: adminRoutes.dress, label: 'O que vestir' },
                { href: adminRoutes.album, label: 'Álbum' },
              ]}
            />
          ) : null}
          <NavGroup
            id="guests"
            label="Convidados"
            path={path}
            items={[
              { href: adminRoutes.guests, label: 'Lista' },
              { href: adminRoutes.confirmations, label: 'Confirmações' },
            ]}
          />
          {canManageGifts(user.role) ? (
            <NavGroup
              id="gifts"
              label="Presentes"
              path={path}
              items={[{ href: adminRoutes.gifts, label: 'Catálogo' }]}
            />
          ) : null}
          {canManageEvent(user.role) ? (
            <NavGroup
              id="system"
              label="Sistema"
              path={path}
              items={[{ href: adminRoutes.settings, label: 'Configurações' }]}
            />
          ) : null}
        </nav>
        <button className="admin-signout" type="button" onClick={onSignOut}>
          <Icon name="logout" />
          Sair
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-top">
          <button className="admin-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? 'Fechar' : 'Menu'}
          </button>
          <nav className="admin-crumbs" aria-label="Trilha">
            <ol>
              {breadcrumbsFor(path).map((crumb, index, crumbs) => (
                <li key={crumb.label}>
                  {crumb.href ? (
                    <AdminLink href={crumb.href}>{crumb.label}</AdminLink>
                  ) : (
                    <span aria-current={index === crumbs.length - 1 ? 'page' : undefined}>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <div className="admin-user">
            <div className="admin-user-copy">
              <strong>{user.name}</strong>
              <span>{roleLabel(user.role)}</span>
            </div>
            <span className="admin-avatar" aria-hidden="true">
              {user.name.trim().charAt(0).toUpperCase()}
            </span>
          </div>
        </header>
        <div className="admin-content" onClick={close}>
          {children}
        </div>
      </div>
      {toast ? (
        <p
          className={`admin-toast is-${toast.tone}`}
          role={toast.tone === 'error' || toast.tone === 'warning' ? 'alert' : 'status'}
        >
          {toast.message}
        </p>
      ) : null}
    </div>
  );
}
