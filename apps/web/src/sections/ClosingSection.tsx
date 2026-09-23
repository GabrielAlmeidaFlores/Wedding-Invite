import { wedding } from '@/data/wedding';
import { useReveal } from '@/hooks/use-reveal';

export function ClosingSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="closing" aria-labelledby="closing-title" ref={ref}>
      <div className="container container-narrow closing-inner">
        <h3 id="closing-title">{wedding.closing.line1}</h3>
        <img
          className="closing-note"
          src="/images/elementos/recado.svg"
          alt={`${wedding.closing.line2} ${wedding.bride} e ${wedding.groom}. ${wedding.dateLabel}.`}
        />
      </div>
    </section>
  );
}
