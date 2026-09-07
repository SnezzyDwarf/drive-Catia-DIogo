import { Outlet } from "react-router";
import Navbar from "../components/layout/Navbar/Navbar.jsx";
import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
