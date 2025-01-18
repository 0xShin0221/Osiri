import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProd = mode === "production";
  const isEmergency = env.VITE_EMERGENCY_MODE === "true";

  return {
    plugins: [
      react(),
      {
        name: "cache-control",
        configureServer: (server) => {
          server.middlewares.use((req, res, next) => {
            // Handle static assets
            if (req.url.startsWith("/assets/")) {
              res.setHeader(
                "Cache-Control",
                isProd && !isEmergency
                  ? "public, max-age=31536000, immutable" // Long-term caching for assets in production
                  : "no-store",
              );
            } // Handle API requests
            else if (req.url.startsWith("/api/")) {
              res.setHeader("Cache-Control", "no-cache"); // Always verify API responses
            } // Handle all other requests
            else {
              res.setHeader(
                "Cache-Control",
                isProd && !isEmergency
                  ? "public, max-age=3600, stale-while-revalidate=300" // Cache for 1 hour in production
                  : "no-store",
              );
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // Alias for src directory
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Add hash to filenames in production for cache busting
          entryFileNames: isProd
            ? "assets/[name].[hash].js"
            : "assets/[name].js",
          chunkFileNames: isProd
            ? "assets/[name].[hash].js"
            : "assets/[name].js",
          assetFileNames: isProd
            ? "assets/[name].[hash].[ext]"
            : "assets/[name].[ext]",
        },
      },
    },
  };
});
