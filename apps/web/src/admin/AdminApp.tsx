import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clearSession, readSession, writeSession } from '@/lib/backoffice/auth';
import { canManageEvent, canManageGifts } from '@/lib/backoffice/permissions';
import type { SessionUser } from '@/lib/backoffice/types';
import { AdminShell } from '@/admin/components/AdminShell';
import { ConfirmationsPage } from '@/admin/pages/ConfirmationsPage';
import { AlbumPage } from '@/admin/pages/AlbumPage';
import { DashboardPage } from '@/admin/pages/DashboardPage';
import { DressPage } from '@/admin/pages/DressPage';
import { GiftsAdminPage } from '@/admin/pages/GiftsAdminPage';
import { GuestsPage } from '@/admin/pages/GuestsPage';
import { LoginPage } from '@/admin/pages/LoginPage';
import { PlacePage } from '@/admin/pages/PlacePage';
import { SettingsPage } from '@/admin/pages/SettingsPage';
import { WeddingInfoPage } from '@/admin/pages/WeddingInfoPage';
import { adminRoutes, currentPath, navigateTo } from '@/admin/navigate';
import type { AdminToast, Notify } from '@/admin/toast';
import '@/admin/admin.css';

function usePath() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const onPop = () => setPath(currentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

export function AdminApp() {
  const path = usePath();

  useEffect(() => {
    document.title = 'Enlace';
  }, []);
  const [user, setUser] = useState<SessionUser | null>(() => readSession());
  const [toast, setToast] = useState<AdminToast | null>(null);
  const toastTimer = useRef<number | null>(null);

  const notify = useCallback<Notify>((message, tone) => {
    setToast({ message, tone });
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const signIn = (next: SessionUser) => {
    writeSession(next);
    setUser(next);
    navigateTo(adminRoutes.dashboard);
  };

  const signOut = () => {
    clearSession();
    setUser(null);
    navigateTo(adminRoutes.login);
  };

  useEffect(() => {
    if (!user && path !== adminRoutes.login) navigateTo(adminRoutes.login);
    if (user && path === adminRoutes.login) navigateTo(adminRoutes.dashboard);
  }, [path, user]);

  useEffect(() => {
    if (!user) return;
    if (!canManageEvent(user.role) && (path === adminRoutes.wedding || path === adminRoutes.ceremony || path === adminRoutes.reception || path === adminRoutes.dress || path === adminRoutes.album || path === adminRoutes.settings)) {
      navigateTo(adminRoutes.dashboard);
    }
    if (!canManageGifts(user.role) && path === adminRoutes.gifts) {
      navigateTo(adminRoutes.dashboard);
    }
  }, [path, user]);

  const page = useMemo(() => {
    if (!user) return null;
    if (path === adminRoutes.wedding) return <WeddingInfoPage user={user} notify={notify} />;
    if (path === adminRoutes.ceremony) return <PlacePage kind="ceremony" user={user} notify={notify} />;
    if (path === adminRoutes.reception) return <PlacePage kind="reception" user={user} notify={notify} />;
    if (path === adminRoutes.dress) return <DressPage user={user} notify={notify} />;
    if (path === adminRoutes.album) return <AlbumPage user={user} notify={notify} />;
    if (path === adminRoutes.guests) return <GuestsPage user={user} notify={notify} />;
    if (path === adminRoutes.confirmations) return <ConfirmationsPage user={user} />;
    if (path === adminRoutes.gifts) return <GiftsAdminPage user={user} notify={notify} />;
    if (path === adminRoutes.settings) return <SettingsPage user={user} notify={notify} />;
    return <DashboardPage user={user} />;
  }, [notify, path, user]);

  if (!user) {
    return (
      <div className="admin-app">
        <LoginPage onSignedIn={signIn} />
      </div>
    );
  }

  return (
    <div className="admin-app">
      <AdminShell user={user} path={path} onSignOut={signOut} toast={toast}>
        {page}
      </AdminShell>
    </div>
  );
}
