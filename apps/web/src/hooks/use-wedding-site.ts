import { createContext, useContext } from 'react';
import { wedding, type WeddingContent } from '@/data/wedding';

export const WeddingSiteContext = createContext<WeddingContent>(wedding);

export function useWeddingSite(): WeddingContent {
  return useContext(WeddingSiteContext);
}
