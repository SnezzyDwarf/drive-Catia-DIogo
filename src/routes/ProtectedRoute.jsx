import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

import HeroLoadingImage from "../assets/images/HeroLoading.jpg";

import styles from "./ProtectedRoute.module.css";

function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className={styles.loader} role="status" aria-live="polite">
        <img
          className={styles.loaderImage}
          src={HeroLoadingImage}
          alt=""
          aria-hidden="true"
        />
        <div className={styles.overlay} aria-hidden="true" />

        <div className={styles.content}>
          <div className={styles.monogram} aria-hidden="true">
            <span>C</span>
            <svg
              className={styles.heart}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>D</span>
          </div>

          <p className={styles.date}>04-09-2026</p>

          <p className={styles.text}>
            A preparar o site
            <span className={styles.dots} aria-hidden="true">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </p>

          <div className={styles.progress} aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
