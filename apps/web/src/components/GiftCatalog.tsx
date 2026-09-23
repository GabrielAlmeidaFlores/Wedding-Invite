import { wedding } from '@/data/wedding';
import { formatGiftPrice } from '@/lib/gift-price';
import { Button } from '@/components/Button';

export function GiftCatalog() {
  const { gifts } = wedding;

  return (
    <ul className="gift-catalog">
      {gifts.items.map((item) => (
        <li key={item.id}>
          <article className="gift-card">
            <div className="gift-card-media">
              {item.image ? (
                <img src={item.image.src} alt={item.image.alt} decoding="async" loading="lazy" />
              ) : (
                <img
                  className="gift-card-mark"
                  src="/images/elementos/flor1.svg"
                  alt=""
                  decoding="async"
                  loading="lazy"
                />
              )}
            </div>
            <div className="gift-card-body">
              <h4>{item.name}</h4>
              <p className="gift-card-price">{formatGiftPrice(item.priceCents)}</p>
              <Button className="gift-card-give" type="button" fullWidth>
                {gifts.giveLabel}
              </Button>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
