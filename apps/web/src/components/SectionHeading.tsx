import { Ornament } from '@/components/Ornament';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: 'start' | 'center';
  titleId: string;
  ornament?: 'line' | 'flower';
};

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'start',
  titleId,
  ornament = 'line',
}: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'heading heading-center' : 'heading'}>
      <Ornament variant={ornament} />
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h3 id={titleId}>{title}</h3>
      {lede ? <p className="lede">{lede}</p> : null}
    </div>
  );
}
