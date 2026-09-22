import { useEffect, useRef } from 'react';
import { wedding } from '@/data/wedding';
import type { AlbumPhoto } from '@/hooks/use-album';
import { Icon } from '@/components/Icon';

type LightboxProps = {
  photos: readonly AlbumPhoto[];
  activeId: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
};

export function Lightbox({ photos, activeId, onClose, onSelect }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeIndex = photos.findIndex((photo) => photo.id === activeId);
  const active = activeIndex >= 0 ? photos[activeIndex] : undefined;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active && !dialog.open) dialog.showModal();
    if (!active && dialog.open) dialog.close();
  }, [active]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!dialog.open || photos.length < 2) return;
      if (event.key === 'ArrowRight') {
        const next = photos[(activeIndex + 1) % photos.length];
        if (next) onSelect(next.id);
      }
      if (event.key === 'ArrowLeft') {
        const previous = photos[(activeIndex - 1 + photos.length) % photos.length];
        if (previous) onSelect(previous.id);
      }
    };
    dialog.addEventListener('keydown', onKeyDown);
    return () => dialog.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, onSelect, photos]);

  const showNeighbor = (direction: 1 | -1) => {
    if (photos.length < 2) return;
    const next = photos[(activeIndex + direction + photos.length) % photos.length];
    if (next) onSelect(next.id);
  };

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={wedding.album.lightbox}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {active ? (
        <div className="lightbox-layout">
          <button className="lightbox-close" type="button" onClick={onClose}>
            <Icon name="close" />
            <span className="visually-hidden">{wedding.album.close}</span>
          </button>
          <img src={active.url} alt={active.alt} />
          {photos.length > 1 ? (
            <div className="lightbox-nav">
              <button type="button" onClick={() => showNeighbor(-1)}>
                <Icon name="chevron-left" />
                <span className="visually-hidden">{wedding.album.previous}</span>
              </button>
              <button type="button" onClick={() => showNeighbor(1)}>
                <Icon name="chevron-right" />
                <span className="visually-hidden">{wedding.album.next}</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
