type OrnamentProps = {
  variant?: 'line' | 'flower';
};

export function Ornament({ variant = 'line' }: OrnamentProps) {
  if (variant === 'flower') {
    return (
      <img
        className="ornament ornament-flower"
        src="/images/elementos/flor1.svg"
        alt=""
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="ornament" aria-hidden="true">
      <span />
    </div>
  );
}
