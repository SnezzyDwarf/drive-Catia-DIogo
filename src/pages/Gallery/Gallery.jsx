import Gallery from "../../components/layout/Gallery/Gallery";
import HeroGallery from "../../components/layout/HeroGallery/HeroGallery";
import "./Gallery.css";

function Page2() {
  return (
    <section className="page2">
      <HeroGallery />
      <Gallery />
    </section>
  );
}

export default Page2;
