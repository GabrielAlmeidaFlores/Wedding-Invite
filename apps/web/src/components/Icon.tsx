type IconName = 'image' | 'close' | 'chevron-left' | 'chevron-right' | 'logout';

type IconProps = {
  name: IconName;
  className?: string;
};

const paths: Record<IconName, string> = {
  image:
    'M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Zm1.5-.5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-13Zm2 3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM6 16.5l3.2-3.2a1 1 0 0 1 1.4 0L13 15.7l1.4-1.4a1 1 0 0 1 1.4 0L18 16.5',
  close: 'M6.3 6.3 12 12m0 0 5.7 5.7M12 12 6.3 17.7M12 12l5.7-5.7',
  'chevron-left': 'M14.5 6.5 9 12l5.5 5.5',
  'chevron-right': 'M9.5 6.5 15 12l-5.5 5.5',
  logout: 'M10 7V6.2A1.2 1.2 0 0 0 8.8 5H6.2A1.2 1.2 0 0 0 5 6.2v11.6A1.2 1.2 0 0 0 6.2 19h2.6A1.2 1.2 0 0 0 10 17.8V17M13 12h6M16.5 8.5 20 12l-3.5 3.5',
};

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={paths[name]} />
    </svg>
  );
}
