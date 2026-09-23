import { Ornament } from '@/components/Ornament';

type SectionHeadingProps = {
  eyebrow?: string;
  title?: string;
  lede?: string;
  align?: 'start' | 'center';
  titleId: string;
  ornament?: 'line' | 'flower' | 'none';
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
      {ornament === 'none' ? null : <Ornament variant={ornament} />}
      {eyebrow ? (
        <p className="eyebrow" id={title ? undefined : titleId}>
          {eyebrow}
        </p>
      ) : null}
      {title ? <h3 id={titleId}>{title}</h3> : null}
      {lede ? <p className="lede">{lede}</p> : null}
    </div>
  );
}
