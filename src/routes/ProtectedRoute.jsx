import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
