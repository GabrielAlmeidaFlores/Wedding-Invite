import { describe, expect, it } from 'vitest';
import { adminRoutes, breadcrumbsFor } from '@/admin/navigate';

describe('breadcrumbsFor', () => {
  it('should show only the dashboard on the home screen', () => {
    expect(breadcrumbsFor(adminRoutes.dashboard)).toEqual([{ label: 'Dashboard' }]);
  });

  it('should place the section before the current screen', () => {
    expect(breadcrumbsFor(adminRoutes.ceremony)).toEqual([
      { label: 'Dashboard', href: adminRoutes.dashboard },
      { label: 'Casamento', href: adminRoutes.wedding },
      { label: 'Cerimônia' },
    ]);
  });

  it('should keep the section label when it shares the current address', () => {
    expect(breadcrumbsFor(adminRoutes.wedding)).toEqual([
      { label: 'Dashboard', href: adminRoutes.dashboard },
      { label: 'Casamento' },
      { label: 'Informações' },
    ]);
  });
});
