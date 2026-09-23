import { useWeddingSite } from '@/hooks/use-wedding-site';
import { useReveal } from '@/hooks/use-reveal';

export function ClosingSection() {
  const wedding = useWeddingSite();
  const ref = useReveal<HTMLElement>();
  const desktopArt =
    wedding.closing.artDesktop && wedding.closing.artDesktop !== wedding.closing.art
      ? wedding.closing.artDesktop
      : '';

  return (
    <section className="closing" aria-labelledby="closing-title" ref={ref}>
      <div className="container container-narrow closing-inner">
        <h3 id="closing-title">{wedding.closing.line1}</h3>
        <picture>
          {desktopArt ? <source media="(min-width: 960px)" srcSet={desktopArt} /> : null}
          <img
            className="closing-note"
            src={wedding.closing.art}
            alt={`${wedding.closing.line2} ${wedding.bride} e ${wedding.groom}. ${wedding.dateLabel}.`}
            decoding="async"
            loading="lazy"
          />
        </picture>
      </div>
    </section>
  );
}
