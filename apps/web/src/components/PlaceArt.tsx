export function ChurchArt() {
  return (
    <svg className="place-art" viewBox="0 0 168 112" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
        <path d="M46 98V76" />
        <path d="M46 78c-11-1-16-12-12-24 3-8 12-14 12-14s9 6 12 14c4 12-1 23-12 24Z" />
        <path d="M122 98V76" />
        <path d="M122 78c-11-1-16-12-12-24 3-8 12-14 12-14s9 6 12 14c4 12-1 23-12 24Z" />
        <path d="M64 98V56h40v42" />
        <path d="M58 56 84 32l26 24" />
        <path d="M84 32V20" />
        <path d="M77.5 20h13" />
        <path d="M84 13.5V20" />
        <path d="M76 98V80a8 8 0 0 1 16 0v18" />
        <circle cx="84" cy="50" r="2.6" />
      </g>
    </svg>
  );
}

export function CheersArt() {
  return (
    <svg className="place-art" viewBox="0 0 168 100" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 42c10 1 16 9 14 16-9-1-16-8-14-16Z" />
        <path d="M28 50c7 2 10 8 8 13" />
        <g transform="rotate(-16 64 48)">
          <path d="M52 16h24l-4 30a8 8 0 0 1-8 7h0a8 8 0 0 1-8-7Z" />
          <path d="M64 53v24" />
          <path d="M54 77h20" />
        </g>
        <g transform="rotate(16 104 48)">
          <path d="M92 16h24l-4 30a8 8 0 0 1-8 7h0a8 8 0 0 1-8-7Z" />
          <path d="M104 53v24" />
          <path d="M94 77h20" />
        </g>
        <path d="M146 42c-10 1-16 9-14 16 9-1 16-8 14-16Z" />
        <path d="M140 50c-7 2-10 8-8 13" />
      </g>
    </svg>
  );
}

export function PlaceDivider() {
  return (
    <div className="place-divider" aria-hidden="true">
      <span />
      <svg className="place-sprig" viewBox="0 0 52 16" fill="none">
        <path d="M26 10c-6 0-12-3-18-5 6 1 12 3 18 5 6-2 12-4 18-5-6 2-12 5-18 5Z" stroke="currentColor" strokeWidth="1.05" strokeLinejoin="round" />
        <path d="M26 10c-3-3-4-6-2.5-8 1.2 2.4 2 5 2.5 8 .5-3 1.3-5.6 2.5-8-1.5 2-2.5 5-2.5 8Z" stroke="currentColor" strokeWidth="1.05" strokeLinejoin="round" />
      </svg>
      <span />
    </div>
  );
}
