import { useRef, useState } from 'react';
import { wedding } from '@/data/wedding';
import { useAlbum } from '@/hooks/use-album';
import { useReveal } from '@/hooks/use-reveal';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Lightbox } from '@/components/Lightbox';
import { SectionHeading } from '@/components/SectionHeading';

export function AlbumSection() {
  const ref = useReveal<HTMLElement>();
  const inputRef = useRef<HTMLInputElement>(null);
  const { photos, addFiles, removePhoto } = useAlbum();
  const [activeId, setActiveId] = useState<string | null>(null);
  const copy = wedding.album;

  return (
    <section className="section section-album" id="album" aria-labelledby="album-title" ref={ref}>
      <div className="container">
        <SectionHeading
          align="center"
          titleId="album-title"
          eyebrow={copy.eyebrow}
          title={copy.title}
          lede={copy.text}
          ornament="flower"
        />
        <div className="section-actions">
          <Button type="button" onClick={() => inputRef.current?.click()}>
            {copy.share}
          </Button>
          <input
            ref={inputRef}
            className="visually-hidden"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = '';
            }}
          />
        </div>

        {photos.length === 0 ? (
          <div className="album-empty">
            <Icon name="image" />
            <p>{copy.empty}</p>
          </div>
        ) : (
          <ul className="album-grid">
            {photos.map((photo) => (
              <li key={photo.id}>
                <AlbumFigure
                  url={photo.url}
                  alt={photo.alt}
                  onOpen={() => setActiveId(photo.id)}
                  onRemove={() => {
                    removePhoto(photo.id);
                    setActiveId((current) => (current === photo.id ? null : current));
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <img className="album-simba" src="/images/elementos/simba2.webp" alt="" decoding="async" loading="lazy" />
      <Lightbox photos={photos} activeId={activeId} onClose={() => setActiveId(null)} onSelect={setActiveId} />
    </section>
  );
}

type AlbumFigureProps = {
  url: string;
  alt: string;
  onOpen: () => void;
  onRemove: () => void;
};

function AlbumFigure({ url, alt, onOpen, onRemove }: AlbumFigureProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure>
      {failed ? (
        <p className="album-failed">{wedding.album.unreadable}</p>
      ) : (
        <button type="button" className="album-open" onClick={onOpen}>
          <img src={url} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
        </button>
      )}
      <button className="photo-remove" type="button" onClick={onRemove}>
        <Icon name="close" />
        <span className="visually-hidden">{wedding.album.remove}</span>
      </button>
    </figure>
  );
}
