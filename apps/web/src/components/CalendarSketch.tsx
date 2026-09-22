type MarkProps = {
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
};

function Flower({ x, y, rotate = 0, scale = 1 }: MarkProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g fill="#F7F4EE" stroke="#02345B" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="0" cy="-9" r="4.6" />
        <circle cx="8.6" cy="-2.8" r="4.6" />
        <circle cx="5.3" cy="7.4" r="4.6" />
        <circle cx="-5.3" cy="7.4" r="4.6" />
        <circle cx="-8.6" cy="-2.8" r="4.6" />
      </g>
      <circle cx="0" cy="0" r="2.3" fill="#B7753E" />
    </g>
  );
}

function Leaf({ x, y, rotate = 0, scale = 1 }: MarkProps) {
  return (
    <path
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
      d="M0 2C12-2 20 10 14 18 4 20-4 10 0 2Z"
      fill="#E7EEE8"
      stroke="#02345B"
      strokeWidth="1.15"
      strokeLinejoin="round"
    />
  );
}

export function CalendarSketch() {
  return (
    <svg className="calendar-sketch" viewBox="0 0 440 360" aria-hidden="true">
      <rect
        x="54"
        y="40"
        width="332"
        height="280"
        rx="26"
        fill="none"
        stroke="#02345B"
        strokeOpacity="0.38"
        strokeWidth="1.25"
      />
      <Flower x={54} y={40} scale={0.92} />
      <Leaf x={28} y={58} rotate={-28} scale={0.85} />
      <Flower x={386} y={46} rotate={18} scale={0.78} />
      <Leaf x={404} y={28} rotate={40} scale={0.7} />
      <Flower x={58} y={316} rotate={-12} scale={0.72} />
      <Leaf x={34} y={292} rotate={150} scale={0.7} />
      <Flower x={382} y={312} rotate={8} scale={0.86} />
      <Leaf x={408} y={300} rotate={210} scale={0.78} />
    </svg>
  );
}
