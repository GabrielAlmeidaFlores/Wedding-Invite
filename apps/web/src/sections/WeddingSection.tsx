import { wedding } from '@/data/wedding';
import { buildCalendarIcs } from '@/lib/calendar-event';
import { mapsLink } from '@/lib/maps';
import { useReveal } from '@/hooks/use-reveal';
import { Button } from '@/components/Button';
import { CalendarSketch } from '@/components/CalendarSketch';
import { Icon } from '@/components/Icon';
import { SectionHeading } from '@/components/SectionHeading';

function saveWeddingCalendar(): void {
  const ceremony = wedding.places[0];
  const reception = wedding.places[1];
  if (!ceremony) return;

  const receptionLine = reception
    ? ` Recepção ${reception.when.charAt(0).toLowerCase()}${reception.when.slice(1)} no ${reception.name}, ${reception.address}.`
    : '';
  const ics = buildCalendarIcs(
    {
      title: `Casamento de ${wedding.bride} e ${wedding.groom}`,
      startIso: wedding.dateTimeIso,
      durationHours: 2,
      location: `${ceremony.name}, ${ceremony.address}`,
      description: `Cerimônia ${ceremony.when} na ${ceremony.name}, ${ceremony.address}.${receptionLine}`,
      uid: 'casamento-geisa-vitoria-joao-gabriel-20280520',
    },
    new Date(),
  );
  const file = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'casamento-geisa-e-joao-gabriel.ics';
  link.click();
  URL.revokeObjectURL(url);
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
        <dl className="info-grid">
          <div className="info-item info-calendar">
            <button type="button" className="calendar-add" onClick={saveWeddingCalendar}>
              <span className="calendar-art">
                <CalendarSketch />
                <img className="calendar-sheet" src="/images/elementos/calendario.svg" alt="" />
              </span>
              <span className="calendar-add-label">{wedding.wedding.calendarAddLabel}</span>
            </button>
          </div>
          {wedding.places.map((place) => (
            <div className="info-item place-card" key={place.id}>
              <Icon name={place.icon} />
              <dt>{place.label}</dt>
              <dd className="place-when">
                {place.when.split(' | ').map((part) => (
                  <span key={part}>{part}</span>
                ))}
              </dd>
              <dd className="place-name">{place.name}</dd>
              <dd className="place-address">{place.address}</dd>
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
          ))}
        </dl>
      </div>
    </section>
  );
}
