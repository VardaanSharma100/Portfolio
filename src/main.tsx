
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.tsx";
import { setTheme } from "@/lib/theme";

// Set default theme to dark on mobile if no theme is set
if (typeof window !== "undefined") {
  const isMobile = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const storedTheme = window.localStorage.getItem("theme");
  if (!storedTheme && isMobile) {
    setTheme("dark");
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
