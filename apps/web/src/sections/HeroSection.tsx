import { useRef } from 'react';
import { useWeddingSite } from '@/hooks/use-wedding-site';
import { useInviteOpen } from '@/hooks/use-invite-open';

export function HeroSection() {
  const wedding = useWeddingSite();
  const stageRef = useRef<HTMLElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  useInviteOpen(stageRef, flapRef);

  return (
    <section className="invite-stage" id="inicio" ref={stageRef} aria-labelledby="inicio-title">
      <div className="invite-sticky">
        <div className="invite-flap" ref={flapRef}>
          <div className="hero-envelope-frame">
            <picture>
              {wedding.hero.envelopeMobile !== wedding.hero.envelope ? (
                <source media="(max-width: 959px)" srcSet={wedding.hero.envelopeMobile} />
              ) : null}
              <img
                className="hero-envelope"
                src={wedding.hero.envelope}
                alt=""
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
          <h1 id="inicio-title" className="hero-names">
            <img
              className="hero-logo"
              src="/images/elementos/logo-extenso.svg"
              alt={`${wedding.bride} e ${wedding.groom}`}
            />
          </h1>
          <p className="hero-date">
            <time dateTime={wedding.dateTimeIso}>{wedding.dateLabel}</time>
          </p>
          <a className="scroll-cue" href="#casamento">
            <span className="scroll-cue-arrow" aria-hidden="true">
              ↓
            </span>
            <span>{wedding.hero.continueLabel}</span>
            <span className="scroll-cue-arrow" aria-hidden="true">
              ↓
            </span>
          </a>
        </div>
        <picture className="invite-photo">
          {wedding.heroImage === '/images/fotos/capa/bg-foto-principal.png' ? (
            <>
              <source media="(max-width: 959px)" type="image/webp" srcSet="/images/fotos/capa/principal-mobile.webp" />
              <source media="(max-width: 959px)" srcSet="/images/fotos/capa/principal-mobile.png" />
              <source type="image/webp" srcSet="/images/fotos/capa/bg-foto-principal.webp" />
            </>
          ) : null}
          <img
            src={wedding.heroImage}
            alt={`${wedding.bride} e ${wedding.groom}`}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}
