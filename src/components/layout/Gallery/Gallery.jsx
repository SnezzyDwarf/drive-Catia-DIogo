import { useEffect, useState } from "react";

import styles from "./Gallery.module.css";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch("/api/photos", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao obter as fotos");
        }

        setPhotos(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPhotos();
  }, []);

  const selectedIndex = selectedPhoto
    ? photos.findIndex((photo) => photo.id === selectedPhoto.id)
    : -1;

  const showPrevPhoto = () => {
    if (selectedIndex === -1) return;

    setSelectedPhoto(
      photos[(selectedIndex - 1 + photos.length) % photos.length],
    );
  };

  const showNextPhoto = () => {
    if (selectedIndex === -1) return;

    setSelectedPhoto(photos[(selectedIndex + 1) % photos.length]);
  };

  return (
    <>
      <div className={styles.gallery}>
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={`/api/photos/${photo.id}/thumbnail`}
            alt={photo.name}
            onClick={() => setSelectedPhoto(photo)}
          />
        ))}
      </div>

      {selectedPhoto && (
        <div className={styles.lightbox} onClick={() => setSelectedPhoto(null)}>
          <button
            type="button"
            className={styles.close}
            aria-label="Fechar"
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className={styles.prev}
                aria-label="Foto anterior"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevPhoto();
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                type="button"
                className={styles.next}
                aria-label="Foto seguinte"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextPhoto();
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          <img
            key={selectedPhoto.id}
            className={styles.fullImage}
            src={`/api/photos/${selectedPhoto.id}`}
            alt={selectedPhoto.name}
            onClick={(event) => event.stopPropagation()}
          />

          <a
            className={styles.download}
            href={`/api/photos/${selectedPhoto.id}/download?name=${encodeURIComponent(selectedPhoto.name)}`}
            onClick={(event) => event.stopPropagation()}
          >
            Download
          </a>
        </div>
      )}
    </>
  );
}

export default Gallery;
