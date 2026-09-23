import { useReveal } from '@/hooks/use-reveal';
import { useWeddingSite } from '@/hooks/use-wedding-site';
import { GiftCatalog } from '@/components/GiftCatalog';
import { Button } from '@/components/Button';
import { SectionHeading } from '@/components/SectionHeading';

export function GiftsSection() {
  const ref = useReveal<HTMLElement>();
  const { gifts } = useWeddingSite();

  return (
    <section className="section section-gifts" id="presentes" aria-labelledby="presentes-title" ref={ref}>
      <div className="container container-narrow">
        <SectionHeading
          align="center"
          titleId="presentes-title"
          eyebrow={gifts.eyebrow}
          title={gifts.title}
          lede={gifts.text}
          ornament="flower"
        />
      </div>
      <div className="container gifts-catalog-wrap">
        <GiftCatalog />
        <div className="section-actions">
          <Button href="/presentes">{gifts.button}</Button>
        </div>
      </div>
      <img className="gifts-present" src="/images/elementos/presente.webp" alt="" decoding="async" loading="lazy" />
    </section>
  );
}
