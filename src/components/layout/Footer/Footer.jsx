import styles from "./Footer.module.css";
import CameraIcon from "../../../assets/icons/CameraIcon";
import HeartIcon from "../../../assets/icons/HeartIcon";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <h1>C&D</h1>
        <p>04-09-2026</p>
      </div>

      <div className={styles.credits}>
        <div className={styles.creditBlock}>
          <p className={styles.thanks}>Obrigado</p>
          <a
            className={styles.creditLink}
            href="https://www.instagram.com/geinerveraph/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CameraIcon size={15} className={styles.creditIcon} />
            <span>
              Fotografia por <span className={styles.handle}>@geinerveraph</span>
            </span>
          </a>
        </div>

        <span className={styles.divider} aria-hidden="true"></span>

        <div className={styles.creditBlock}>
          <div className={styles.madeBy}>
            <span>Feito com</span>
            <HeartIcon size={12} className={styles.heart} />
            <span>por Bruno Pernão</span>
          </div>
          <a
            className={styles.creditLink}
            href="https://personal-website-lyart-tau-75.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver Portefólio
          </a>
        </div>
      </div>

      <div className={styles.tagline}>
        <h4>
          O NOSSO DIA <br />
          PARA SEMPRE RECORDAR
        </h4>
      </div>
    </footer>
  );
}
