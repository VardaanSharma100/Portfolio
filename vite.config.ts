import fs from "fs";
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function serveRunningProjectApps() {
  return {
    name: "serve-running-project-apps",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const [pathname, search = ""] = req.url.split("?");
        const normalizedPath = pathname.replace(/\/+$/, "");
        const match = normalizedPath.match(/^\/([^/]+)\/running$/i);

        if (!match) {
          next();
          return;
        }

        const slug = match[1];
        const projectIndexPath = path.resolve(
          __dirname,
          "public",
          slug,
          "running",
          "index.html"
        );

        if (!fs.existsSync(projectIndexPath)) {
          next();
          return;
        }

        req.url = `/${slug}/running/index.html${search ? `?${search}` : ""}`;
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), serveRunningProjectApps()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'three-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'motion-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
