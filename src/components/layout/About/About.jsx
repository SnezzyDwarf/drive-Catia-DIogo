import styles from "./About.module.css";

//images
import ExploreImage from "../../../assets/images/ExploreImage.jpg";
import FriendsIcon from "../../../assets/icons/FriendsIcon";
import DownloadIcon from "../../../assets/icons/DownloadIcon";
import HeartIcon from "../../../assets/icons/HeartIcon";

export default function About() {
  return (
    <div className={styles.about}>
      <div className={styles.content}>
        <div className={styles.containerImage}>
          <img
            className={styles.image}
            src={ExploreImage}
            alt="Noivos num campanário"
          />
          <div className={styles.title}>
            <h2>
              Obrigado por <br />
              fazerem parte!!
            </h2>
            <HeartIcon className={styles.heartIcon} />
          </div>
        </div>
        <div className={styles.features}>
          <div className={styles.feature}>
            <FriendsIcon />
            <h3>Revive os momentos</h3>
          </div>
          <div className={styles.feature}>
            <DownloadIcon />
            <h3>Guardar para sempre</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
