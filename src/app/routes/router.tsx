import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Login } from "@/features/auth/pages/Login";
import { Dashboard } from "@/features/dashboard/pages/Dashboard";
import { DashboardLayout } from "@/features/dashboard/layout/DashboardLayout";
import { MonitoringPage } from "@/features/dashboard/pages/MonitoringPage";
import MonitoringDetails from "@/features/dashboard/components/Monitor/MonitoringDetails";


export const AppRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-dvh grid place-items-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="monitorar" element={<MonitoringPage />} />
            <Route path="monitorar/:siteId" element={<MonitoringDetails />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

function RequireAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
