import { wedding } from '@/data/wedding';
import { formatGiftPrice } from '@/lib/gift-price';

export function GiftCatalog() {
  return (
    <ul className="gift-catalog">
      {wedding.gifts.items.map((item) => (
        <li key={item.id}>
          <article className="gift-card">
            <div className="gift-card-media">
              {item.image ? (
                <img src={item.image.src} alt={item.image.alt} />
              ) : (
                <img className="gift-card-mark" src="/images/elementos/flor1.svg" alt="" />
              )}
            </div>
            <div className="gift-card-body">
              <h4>{item.name}</h4>
              <p className="gift-card-price">{formatGiftPrice(item.priceCents)}</p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
