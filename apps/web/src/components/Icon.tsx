import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import ChurchOutlined from '@mui/icons-material/ChurchOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import NotesOutlined from '@mui/icons-material/NotesOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';

function CheersIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.6 7.2 8.8 4.6l-.5 6.2a1.7 1.7 0 0 1-1.7 1.5h-.2a1.7 1.7 0 0 1-1.7-1.5z" />
        <path d="M6.5 12.3 5.7 18.2M4 18.2h3.4" />
        <path d="M19.4 7.2 15.2 4.6l.5 6.2a1.7 1.7 0 0 1 1.7 1.5h.2a1.7 1.7 0 0 1 1.7-1.5z" />
        <path d="M17.5 12.3 18.3 18.2M20 18.2h-3.4" />
        <path d="m11.1 3.1.9 1.5.9-1.5" />
      </g>
    </SvgIcon>
  );
}

const icons = {
  calendar: CalendarTodayOutlined,
  cheers: CheersIcon,
  clock: AccessTimeOutlined,
  church: ChurchOutlined,
  pin: PlaceOutlined,
  image: ImageOutlined,
  'chevron-down': KeyboardArrowDownOutlined,
  'chevron-left': ChevronLeftOutlined,
  'chevron-right': ChevronRightOutlined,
  close: CloseOutlined,
  lines: NotesOutlined,
} as const;

type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const Glyph = icons[name];

  return <Glyph className={className ? `icon ${className}` : 'icon'} aria-hidden fontSize="inherit" />;
}
