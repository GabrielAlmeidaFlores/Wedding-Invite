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
            <SectionHeading titleId="dress-code-title" eyebrow={dressCode.eyebrow} title={dressCode.title} />
            <p className="dress-name">{dressCode.name}</p>
            <p className="lede dress-copy">{dressCode.description}</p>
          </div>
          <div>
            <p className="palette-label">{dressCode.paletteLabel}</p>
            <ul className="swatches">
              {dressCode.colors.map((color) => (
                <li key={color.hex}>
                  <span className="swatch" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                  <span className="swatch-name">{color.name}</span>
                </li>
              ))}
            </ul>
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
    </section>
  );
}
