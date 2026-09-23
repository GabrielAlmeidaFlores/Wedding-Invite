import { useReveal } from '@/hooks/use-reveal';
import { useWeddingSite } from '@/hooks/use-wedding-site';
import { SectionHeading } from '@/components/SectionHeading';

export function DressCodeSection() {
  const ref = useReveal<HTMLElement>();
  const { dressCode } = useWeddingSite();

  return (
    <section className="section section-dress" id="dress-code" aria-labelledby="dress-code-title" ref={ref}>
      <div className="container">
        <div className="dress-layout">
          <div>
            <SectionHeading titleId="dress-code-title" eyebrow={dressCode.eyebrow} ornament="none" />
            <p className="dress-name">{dressCode.name}</p>
            {dressCode.description.map((paragraph, index) => (
              <p className="lede dress-copy" key={`${index}-${paragraph}`}>
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
      <img
        className={`dress-simba is-${dressCode.artAlign}`}
        src={dressCode.art}
        alt=""
        decoding="async"
        loading="lazy"
      />
    </section>
  );
}
