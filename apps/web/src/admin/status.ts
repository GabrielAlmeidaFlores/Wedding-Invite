import type { ConfirmationStatus } from '@/lib/backoffice/types';

export const statusCopy: Record<ConfirmationStatus, { label: string; tone: ConfirmationStatus }> = {
  pending: { label: 'Pendente', tone: 'pending' },
  confirmed: { label: 'Confirmado', tone: 'confirmed' },
  declined: { label: 'Não confirmou', tone: 'declined' },
};
