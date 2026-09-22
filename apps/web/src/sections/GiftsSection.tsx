import { wedding } from '@/data/wedding';
import { useReveal } from '@/hooks/use-reveal';
import { Button } from '@/components/Button';
import { SectionHeading } from '@/components/SectionHeading';

export function GiftsSection() {
  const ref = useReveal<HTMLElement>();
  const { gifts } = wedding;

  return (
    <section className="section section-gifts" id="presentes" aria-labelledby="presentes-title" ref={ref}>
      <div className="container container-narrow">
        <SectionHeading
          align="center"
          titleId="presentes-title"
          eyebrow={gifts.eyebrow}
          title={gifts.title}
          lede={gifts.text}
        />
        <div className="section-actions">
          {gifts.url ? (
            <Button href={gifts.url} target="_blank" rel="noreferrer">
              {gifts.button}
            </Button>
          ) : (
            <Button type="button">{gifts.button}</Button>
          )}
        </div>
      </div>
    </section>
  );
}
