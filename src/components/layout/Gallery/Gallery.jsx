import { useEffect, useState } from "react";

import styles from "./Gallery.module.css";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className={styles.loader} role="status" aria-live="polite">
        <div className={styles.loaderMonogram} aria-hidden="true">
          <span>C</span>
          <svg
            className={styles.loaderHeart}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>D</span>
        </div>

        <p className={styles.loaderDate}>04-09-2026</p>

        <p className={styles.loaderText}>
          A carregar as fotografias
          <span className={styles.loaderDots} aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>

        <div className={styles.skeletonGrid} aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className={styles.skeletonItem} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.gallery}>
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.thumbnailUrl}
            alt={photo.name}
            onClick={() => setSelectedPhoto(photo)}
            loading="lazy"
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
            src={selectedPhoto.originalUrl}
            alt={selectedPhoto.name}
            onClick={(event) => event.stopPropagation()}
          />

          <a
            className={styles.download}
            href={selectedPhoto.originalUrl}
            download={selectedPhoto.name}
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
