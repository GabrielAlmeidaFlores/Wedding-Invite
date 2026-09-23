import type { ReactNode, MouseEvent } from 'react';
import { navigateTo } from '@/admin/navigate';

type AdminLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function AdminLink({ href, className, children }: AdminLinkProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateTo(href);
  };

  return (
    <a className={className} href={href} onClick={onClick}>
      {children}
    </a>
  );
}
