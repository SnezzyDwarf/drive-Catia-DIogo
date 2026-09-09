import { useState } from "react";
import { NavLink } from "react-router";

import styles from "./Navbar.module.css";
import Button from "../../ui/Button/Button";
import GoogleDriveIcon from "../../../assets/icons/GoogleDriveIcon";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/gallery", label: "Fotos" },
  { to: "/video", label: "Videos" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <h1>C&D</h1>
        <p>04-09-2026</p>
      </div>

      {/* Links desktop */}
      <div className={styles.links}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? styles.active : styles.notActive
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className={styles.cta}>
        <a
          href="https://drive.google.com/drive/u/1/folders/1_NY0CPR3-_tOp-Evu6s0pJAkplPPeJjY"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ctaBlack">
            <GoogleDriveIcon /> Aceder à Drive
          </Button>
        </a>
      </div>

      {/* Botão hambúrguer (apenas mobile) */}
      <button
        type="button"
        className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ""}`}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? styles.active : styles.notActive
            }
          >
            {item.label}
          </NavLink>
        ))}
        <a
          href="https://drive.google.com/drive/u/1/folders/1_NY0CPR3-_tOp-Evu6s0pJAkplPPeJjY"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ctaBlack" onClick={closeMenu}>
            <GoogleDriveIcon /> Aceder à Drive
          </Button>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
