import { useMemo, type ReactNode } from 'react';
import { wedding } from '@/data/wedding';
import { DEFAULT_WEDDING_ID } from '@/lib/backoffice/seed';
import { getWedding, listGifts } from '@/lib/backoffice/state';
import { mergePublicContent } from '@/lib/backoffice/public-content';
import { WeddingSiteContext } from '@/hooks/use-wedding-site';
import { useBackofficeStore } from '@/hooks/use-backoffice-store';

type WeddingSiteProviderProps = {
  children: ReactNode;
};

export function WeddingSiteProvider({ children }: WeddingSiteProviderProps) {
  const snapshot = useBackofficeStore();
  const content = useMemo(() => {
    const record = getWedding(snapshot, DEFAULT_WEDDING_ID);
    return mergePublicContent(wedding, record, listGifts(snapshot, DEFAULT_WEDDING_ID));
  }, [snapshot]);

  return <WeddingSiteContext.Provider value={content}>{children}</WeddingSiteContext.Provider>;
}
