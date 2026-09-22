import { useRef } from 'react';
import { wedding } from '@/data/wedding';
import { useInviteOpen } from '@/hooks/use-invite-open';

export function HeroSection() {
  const stageRef = useRef<HTMLElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  useInviteOpen(stageRef, flapRef);

  return (
    <section className="invite-stage" id="inicio" ref={stageRef} aria-labelledby="inicio-title">
      <div className="invite-sticky">
        <div className="invite-flap" ref={flapRef}>
          <div className="hero-envelope-frame">
            <img
              className="hero-envelope"
              src="/images/elementos/convite.svg"
              alt=""
              fetchPriority="high"
            />
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
          <source media="(max-width: 959px)" srcSet="/images/fotos/capa/principal-mobile.png" />
          <img
            src="/images/fotos/capa/bg-foto-principal.png"
            alt={`${wedding.bride} e ${wedding.groom}`}
            fetchPriority="high"
          />
        </picture>
      </div>
    </section>
  );
}
