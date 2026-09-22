import { wedding, type WeddingPlace } from '@/data/wedding';
import { padUnit } from '@/lib/countdown';
import { mapsLink } from '@/lib/maps';
import { useCountdown } from '@/hooks/use-countdown';
import { useReveal } from '@/hooks/use-reveal';
import { Button } from '@/components/Button';
import { CheersArt, ChurchArt, PlaceDivider } from '@/components/PlaceArt';
import { SectionHeading } from '@/components/SectionHeading';

const COUNTDOWN_UNITS = [
  { key: 'days', label: 'Dias' },
  { key: 'hours', label: 'Horas' },
  { key: 'minutes', label: 'Minutos' },
  { key: 'seconds', label: 'Segundos' },
] as const;

function WeddingCountdown() {
  const remaining = useCountdown(wedding.dateTimeIso);

  if (remaining.isPast) {
    return <p className="countdown-done">{wedding.hero.countdownFinished}</p>;
  }

  const spoken = `${remaining.days} dias, ${remaining.hours} horas, ${remaining.minutes} minutos e ${remaining.seconds} segundos`;

  return (
    <div className="countdown" role="timer" aria-label={spoken}>
      {COUNTDOWN_UNITS.map((unit) => (
        <div className="countdown-item" key={unit.key}>
          <strong>{padUnit(remaining[unit.key])}</strong>
          <span>{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

function PlaceMark({ icon }: { icon: WeddingPlace['icon'] }) {
  if (icon === 'cheers') return <CheersArt />;
  return <ChurchArt />;
}

export function WeddingSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section section-wedding" id="casamento" aria-labelledby="casamento-title" ref={ref}>
      <div className="container">
        <blockquote className="wedding-quote">
          <p>“{wedding.wedding.quote}”</p>
          <footer>— {wedding.wedding.quoteAuthor}</footer>
        </blockquote>
        <SectionHeading
          titleId="casamento-title"
          eyebrow={wedding.wedding.eyebrow}
          title={wedding.wedding.title}
          lede={wedding.wedding.lede}
          ornament="flower"
        />
        <div className="celebration">
          <WeddingCountdown />
          <div className="place-row">
            {wedding.places.map((place) => (
              <div className="place-block" key={place.id}>
                <PlaceDivider />
                <div className="place-card">
                  <PlaceMark icon={place.icon} />
                  <h3 className="place-label">{place.label}</h3>
                  <p className="place-when">{place.when}</p>
                  <p className="place-name">{place.name}</p>
                  <p className="place-address">{place.address}</p>
                  <div className="place-actions">
                    <Button
                      href={mapsLink(`${place.name}, ${place.address}`, '')}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {wedding.wedding.mapsLabel}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
