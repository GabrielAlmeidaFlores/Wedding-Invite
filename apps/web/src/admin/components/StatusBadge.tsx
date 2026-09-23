import { statusCopy } from '@/admin/status';
import type { ConfirmationStatus } from '@/lib/backoffice/types';

export function StatusBadge({ status }: { status: ConfirmationStatus }) {
  const copy = statusCopy[status];
  return <span className={`admin-badge is-${copy.tone}`}>{copy.label}</span>;
}
