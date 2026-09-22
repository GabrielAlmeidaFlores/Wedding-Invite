import { useEffect, useRef, useState } from 'react';

export type AlbumPhoto = {
  id: string;
  url: string;
  alt: string;
};

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Pré-visualização local das fotos.
 * Trocar `addFiles` pelo envio ao armazenamento quando o álbum compartilhado existir.
 */
export function useAlbum() {
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const photosRef = useRef(photos);
  photosRef.current = photos;

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file, index) => ({
        id: createId(),
        url: URL.createObjectURL(file),
        alt: `Foto compartilhada ${photosRef.current.length + index + 1}`,
      }));
    if (next.length === 0) return;
    setPhotos((current) => [...current, ...next]);
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const photo = current.find((item) => item.id === id);
      if (photo) URL.revokeObjectURL(photo.url);
      return current.filter((item) => item.id !== id);
    });
  };

  return { photos, addFiles, removePhoto };
}
