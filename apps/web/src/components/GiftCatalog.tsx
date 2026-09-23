import { useWeddingSite } from '@/hooks/use-wedding-site';
import { formatGiftPrice } from '@/lib/gift-price';
import { Button } from '@/components/Button';

export function GiftCatalog() {
  const { gifts } = useWeddingSite();

  if (gifts.items.length === 0) {
    return <p className="gift-catalog-empty">Nenhum presente disponível no momento.</p>;
  }

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
              {item.description ? <p className="gift-card-description">{item.description}</p> : null}
              {item.priceCents === undefined ? null : (
                <p className="gift-card-price">{formatGiftPrice(item.priceCents)}</p>
              )}
              {item.link ? (
                <Button className="gift-card-give" href={item.link} target="_blank" rel="noreferrer" fullWidth>
                  {gifts.giveLabel}
                </Button>
              ) : (
                <Button className="gift-card-give" type="button" fullWidth>
                  {gifts.giveLabel}
                </Button>
              )}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
