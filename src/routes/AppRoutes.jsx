import { Routes, Route } from "react-router";
import MainLayout from "../layouts/MainLayout.jsx";
import Home from "../pages/Home/Home.jsx";
import Gallery from "../pages/Gallery/Gallery.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
