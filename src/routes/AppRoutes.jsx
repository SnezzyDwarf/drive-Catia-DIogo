import { Routes, Route } from "react-router";

import MainLayout from "../layouts/MainLayout.jsx";

import Home from "../pages/Home/Home.jsx";
import Gallery from "../pages/Gallery/Gallery.jsx";
import GalleryVideos from "../pages/GalleryVideos/GalleryVideos.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";

import Login from "../pages/Login/Login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/video" element={<GalleryVideos />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
