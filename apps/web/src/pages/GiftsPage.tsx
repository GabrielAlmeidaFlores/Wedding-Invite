import { wedding } from '@/data/wedding';
import { GiftCatalog } from '@/components/GiftCatalog';
import { SectionHeading } from '@/components/SectionHeading';
import { SiteCredit } from '@/components/SiteCredit';
import { ClosingSection } from '@/sections/ClosingSection';

export function GiftsPage() {
  const { gifts } = wedding;

  return (
    <>
      <header className="page-bar">
        <a className="brand" href="/">
          <img className="brand-logo" src="/images/elementos/logo-principal.svg" alt={wedding.monogram} />
        </a>
        <a className="page-back" href="/">
          Voltar ao convite
        </a>
      </header>
      <main>
        <section className="section section-gifts" aria-labelledby="presentes-title">
          <div className="container">
            <SectionHeading
              align="center"
              titleId="presentes-title"
              eyebrow={gifts.eyebrow}
              title={gifts.title}
              lede={gifts.text}
              ornament="flower"
            />
            <GiftCatalog />
          </div>
        </section>
        <ClosingSection />
      </main>
      <SiteCredit />
    </>
  );
}
