import { Outlet } from "react-router";
import Navbar from "../components/layout/Navbar/Navbar.jsx";
import "./MainLayout.css";
import Footer from "../components/layout/Footer/Footer.jsx";

function MainLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
