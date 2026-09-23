import { describe, expect, it } from 'vitest';
import { formatGiftPrice } from '@/lib/gift-price';

describe('formatGiftPrice', () => {
  it('should format cents as Brazilian reais', () => {
    expect(formatGiftPrice(18900)).toBe('R$\u00a0189,00');
    expect(formatGiftPrice(0)).toBe('R$\u00a00,00');
  });
});
