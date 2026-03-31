import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useRefreshScrollRestore } from "@/hooks/useRefreshScrollRestore";
import Home from "./pages/Home";
import { Navbar } from "./pages/Navbar";
import Services from "./pages/Services.tsx";
import ProjectDetails from "./pages/ProjectDetails";
import { settings } from "@/config/settings";
import { useToasts, dismissToast } from "@/lib/toast";
import { ToastContainer } from "@/components/ui/common/toast-container";

function Layout(): React.ReactElement {
  useRefreshScrollRestore();
  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <Outlet />
    </>
  );
}

function ServicesRoute(): React.ReactElement {
  return settings.services.enabled ? (
    <Services />
  ) : (
    <Navigate to="/" replace />
  );
}

function Root(): React.ReactElement {
  const toasts = useToasts() || [];
  const handleDismiss = (id: string) => dismissToast(id);

  React.useEffect(() => {
    // If the user refreshed the page and the URL is not the home page, redirect to home
    const isNavigationRefreshed = window.performance?.navigation?.type === 1 ||
      (window.performance?.getEntriesByType("navigation")[0] as any)?.type === "reload";

    // Also, handle the case where "back" caching is breaking React.
    // If we're fully mounted on non-root after a refresh, go home.
    if (isNavigationRefreshed) {
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }
  }, []);

  return (
    <>
      <Outlet />
      <ToastContainer toasts={toasts} onDismiss={handleDismiss} />
      <SpeedInsights />
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<ServicesRoute />} />
        <Route path=":projectSlug" element={<ProjectDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Route>
  )
);

function App(): React.ReactElement {
  return <RouterProvider router={router} />;
}

export default App;
