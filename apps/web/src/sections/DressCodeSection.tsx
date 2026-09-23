import { wedding } from '@/data/wedding';
import { useReveal } from '@/hooks/use-reveal';
import { SectionHeading } from '@/components/SectionHeading';

export function DressCodeSection() {
  const ref = useReveal<HTMLElement>();
  const { dressCode } = wedding;

  return (
    <section className="section section-dress" id="dress-code" aria-labelledby="dress-code-title" ref={ref}>
      <div className="container">
        <div className="dress-layout">
          <div>
            <SectionHeading titleId="dress-code-title" eyebrow={dressCode.eyebrow} ornament="none" />
            <p className="dress-name">{dressCode.name}</p>
            {dressCode.description.map((paragraph) => (
              <p className="lede dress-copy" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        {dressCode.references.length > 0 ? (
          <div className="references">
            <h3>{dressCode.referencesTitle}</h3>
            <ul>
              {dressCode.references.map((image) => (
                <li key={image.src}>
                  <img src={image.src} alt={image.alt} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <img className="dress-simba" src="/images/elementos/simba1.webp" alt="" decoding="async" loading="lazy" />
    </section>
  );
}
