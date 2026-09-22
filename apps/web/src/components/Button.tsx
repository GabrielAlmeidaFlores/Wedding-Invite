import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type CommonProps = {
  children: ReactNode;
  variant?: 'solid' | 'ghost';
  fullWidth?: boolean;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

function classNames(variant: 'solid' | 'ghost', fullWidth: boolean | undefined, className?: string) {
  return ['btn', variant === 'ghost' ? 'btn-ghost' : 'btn-solid', fullWidth ? 'btn-block' : '', className]
    .filter(Boolean)
    .join(' ');
}

export function Button(props: ButtonProps | AnchorProps) {
  const { variant = 'solid', fullWidth = false, className, children } = props;
  const classes = classNames(variant, fullWidth, className);

  if ('href' in props && typeof props.href === 'string') {
    const anchorProps = props as AnchorProps;
    return (
      <a className={classes} href={anchorProps.href} target={anchorProps.target} rel={anchorProps.rel}>
        {children}
      </a>
    );
  }

  const { type = 'button', disabled, onClick, 'aria-describedby': describedBy } = props;
  return (
    <button
      className={classes}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-describedby={describedBy}
    >
      {children}
    </button>
  );
}
