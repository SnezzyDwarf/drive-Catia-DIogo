import styles from "./Explore.module.css";

//icons
import CameraIcon from "../../../assets/icons/CameraIcon";
import VideoIcon from "../../../assets/icons/VideoIcon";
import ExportIcon from "../../../assets/icons/ExportIcon";

export default function Explore() {
  return (
    <div className={styles.explore}>
      <div className={styles.text}>
        <h2>Explora os nossos Momentos</h2>
        <p>Clica para veres o conteúdo</p>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <CameraIcon />
          <h3>Fotos</h3>
          <p>Todos os momentos captados</p>
        </div>
        <div className={styles.container}>
          <VideoIcon />
          <h3>Videos</h3>
          <p>Revive os melhores momentos</p>
        </div>
        <div className={styles.container}>
          <ExportIcon />
          <h3>Carregar</h3>
          <p>
            Para adicionar as suas fotos, carregue em aceder a drive, abra a
            pasta e carregue em + Novo. Escolha Carregar ficheiros, selecione as
            fotografias e videos que pretende partilhar e, no final, carregue em
            Carregar. Por favor escolha as pastas correctas
          </p>
        </div>
      </div>
      <div className={styles.subtext}>
        <h3>
          Mais do que um dia <br />
          Uma vida inteira cheia de memórias
        </h3>
      </div>
    </div>
  );
}
