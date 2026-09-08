import About from "../../components/layout/About/About";
import Explore from "../../components/layout/ExploreHome/Explore";
import HeroHome from "../../components/layout/HeroHome/HeroHome";
import "./Home.css";

function Page1() {
  return (
    <section className="page1">
      <HeroHome />
      <Explore />
      <About />
    </section>
  );
}

export default Page1;
