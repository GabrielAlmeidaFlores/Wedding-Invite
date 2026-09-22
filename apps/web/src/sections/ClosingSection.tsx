import { wedding } from '@/data/wedding';
import { useReveal } from '@/hooks/use-reveal';
import { Ornament } from '@/components/Ornament';

export function ClosingSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="closing" aria-labelledby="closing-title" ref={ref}>
      <div className="container container-narrow closing-inner">
        <Ornament />
        <h3 id="closing-title">{wedding.closing.line1}</h3>
        <p className="closing-copy">{wedding.closing.line2}</p>
        <p className="closing-names">
          <span>{wedding.bride}</span>
          <span aria-hidden="true">&</span>
          <span className="visually-hidden"> e </span>
          <span>{wedding.groom}</span>
        </p>
        <p className="closing-date">{wedding.dateLabel}</p>
      </div>
    </section>
  );
}
