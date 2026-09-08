import HeroPhotoGallery from "../../../assets/images/heroPhotoGallery.jpg";

//css
import styles from "./HeroGallery.module.css";

export default function HeroGallery() {
  return (
    <div className={styles.hero}>
      <img src={HeroPhotoGallery} alt="Foto de grupo" />
    </div>
  );
}
