import HeroImage from "../../../assets/images/HeroHome.jpg";
import Button from "../../ui/Button/Button";

import styles from "./HeroHome.module.css";

export default function HeroHome() {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h4>O NOSSO CASAMENTO</h4>
          <h1>
            Memórias <br /> que duram para sempre
          </h1>
          <p>
            Fotos e vídeos num único lugar. Para reviver cada <br />
            Momento
          </p>
          <Button variant="ctaBlackHero">Ver Fotos </Button>
        </div>
        <div className={styles.containerImage}>
          <img
            className={styles.image}
            src={HeroImage}
            alt="Os noivos de mão dada, foto em tons de sépia"
          />
          <div className={styles.subText}>
            <p>
              Pequenos momentos <br /> grandes Histórias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
