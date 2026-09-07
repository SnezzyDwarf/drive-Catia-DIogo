import { Link } from "react-router";
import "./NotFound.css";

function NotFound() {
  return (
    <section className="not-found">
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/">Voltar ao Inicio</Link>
    </section>
  );
}

export default NotFound;
