export function currentPath(): string {
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

export function navigateTo(path: string) {
  if (currentPath() === path) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export const adminRoutes = {
  login: '/admin/entrar',
  dashboard: '/admin',
  wedding: '/admin/casamento',
  ceremony: '/admin/casamento/cerimonia',
  reception: '/admin/casamento/festa',
  dress: '/admin/casamento/traje',
  album: '/admin/casamento/album',
  guests: '/admin/convidados',
  confirmations: '/admin/convidados/confirmacoes',
  gifts: '/admin/presentes',
  settings: '/admin/configuracoes',
} as const;

export type Breadcrumb = {
  label: string;
  href?: string;
};

const trails: Record<string, readonly Breadcrumb[]> = {
  [adminRoutes.dashboard]: [{ label: 'Dashboard' }],
  [adminRoutes.wedding]: [
    { label: 'Casamento', href: adminRoutes.wedding },
    { label: 'Informações' },
  ],
  [adminRoutes.ceremony]: [
    { label: 'Casamento', href: adminRoutes.wedding },
    { label: 'Cerimônia' },
  ],
  [adminRoutes.reception]: [
    { label: 'Casamento', href: adminRoutes.wedding },
    { label: 'Festa' },
  ],
  [adminRoutes.dress]: [
    { label: 'Casamento', href: adminRoutes.wedding },
    { label: 'O que vestir' },
  ],
  [adminRoutes.album]: [
    { label: 'Casamento', href: adminRoutes.wedding },
    { label: 'Álbum' },
  ],
  [adminRoutes.guests]: [
    { label: 'Convidados', href: adminRoutes.guests },
    { label: 'Lista' },
  ],
  [adminRoutes.confirmations]: [
    { label: 'Convidados', href: adminRoutes.guests },
    { label: 'Confirmações' },
  ],
  [adminRoutes.gifts]: [
    { label: 'Presentes', href: adminRoutes.gifts },
    { label: 'Catálogo' },
  ],
  [adminRoutes.settings]: [
    { label: 'Sistema', href: adminRoutes.settings },
    { label: 'Configurações' },
  ],
};

export function breadcrumbsFor(path: string): Breadcrumb[] {
  const trail = trails[path] ?? [{ label: 'Dashboard', href: adminRoutes.dashboard }];
  const withHome =
    path === adminRoutes.dashboard ? trail : [{ label: 'Dashboard', href: adminRoutes.dashboard }, ...trail];

  return withHome.map((crumb, index) => {
    const isLast = index === withHome.length - 1;
    if (isLast || crumb.href === path) return { label: crumb.label };
    return crumb;
  });
}
