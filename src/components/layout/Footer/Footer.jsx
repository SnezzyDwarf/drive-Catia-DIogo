import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.right}>
        <h1>C&D</h1>
        <p>04-09-2026</p>
      </div>
      <div className={styles.center}>
        <h3>Feito por Bruno Pernão</h3>
        <a
          href="https://personal-website-lyart-tau-75.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver Portefófilo
        </a>
      </div>
      <div className={styles.left}>
        <h4>
          O NOSSO DIA <br />
          PARA SEMPRE RECORDAR
        </h4>
      </div>
    </footer>
  );
}
