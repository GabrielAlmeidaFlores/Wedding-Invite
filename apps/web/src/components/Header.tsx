import { useEffect, useState } from 'react';
import { sectionIds } from '@/data/wedding';
import { useWeddingSite } from '@/hooks/use-wedding-site';
import { useActiveSection } from '@/hooks/use-active-section';
import { useMediaQuery } from '@/hooks/use-media-query';

const DESKTOP_NAV = '(min-width: 960px)';

export function Header() {
  const wedding = useWeddingSite();
  const active = useActiveSection(sectionIds);
  const isDesktop = useMediaQuery(DESKTOP_NAV);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const menuOpen = open && !isDesktop && visible;

  useEffect(() => {
    const weddingSection = document.getElementById(sectionIds[1] ?? '');
    const weddingStart = weddingSection?.querySelector('.wedding-quote') ?? weddingSection;
    if (!weddingStart) return;

    let frame = 0;
    let lastScrolled = false;
    let lastVisible = false;

    const update = () => {
      frame = 0;
      const nextScrolled = window.scrollY > 8;
      const headerHeight = document.querySelector('.sticky-header')?.getBoundingClientRect().height ?? 0;
      const nextVisible = weddingStart.getBoundingClientRect().top <= headerHeight;
      if (nextScrolled !== lastScrolled) {
        lastScrolled = nextScrolled;
        setScrolled(nextScrolled);
      }
      if (nextVisible !== lastVisible) {
        lastVisible = nextVisible;
        setVisible(nextVisible);
      }
    };

    const onScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  const closeMenu = () => setOpen(false);

  return (
    <div
      className={[
        'sticky-header',
        scrolled ? 'is-scrolled' : '',
        visible ? 'is-visible' : '',
        menuOpen ? 'is-menu-open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <a className="skip-link" href="#inicio">
        Ir para o conteúdo
      </a>
      <div className="header-bar" inert={!visible} aria-hidden={!visible}>
        <a className="brand" href="#inicio" onClick={closeMenu}>
          <img
            className="brand-logo"
            src={wedding.logoUrl}
            alt={wedding.monogram}
          />
        </a>
        <button
          className={menuOpen ? 'menu-toggle is-open' : 'menu-toggle'}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="menu-toggle-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="visually-hidden">{menuOpen ? 'Fechar menu' : 'Abrir menu'}</span>
        </button>
      </div>
      <nav
        id="site-menu"
        className={menuOpen ? 'nav-panel is-open' : 'nav-panel'}
        aria-label="Seções"
        hidden={!visible || (!isDesktop && !open)}
        inert={!visible}
      >
        <ul className="nav-list">
          {wedding.navigation.map((item) => (
            <li key={item.id}>
              <a
                className="nav-link"
                href={item.href}
                aria-current={active === item.id ? 'true' : undefined}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
