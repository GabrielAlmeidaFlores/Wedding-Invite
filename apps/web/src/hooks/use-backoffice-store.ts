import { useSyncExternalStore } from 'react';
import { getBackofficeState, subscribeBackoffice } from '@/lib/backoffice/store';

export function useBackofficeStore() {
  return useSyncExternalStore(subscribeBackoffice, getBackofficeState, getBackofficeState);
}
