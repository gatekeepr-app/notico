import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
  server: {
    proxy: {
      "/api/uploadthing": {
        target: "http://localhost:3456",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.svg", "icons/*.png"],
      manifest: {
        name: "Notico",
        short_name: "Notico",
        description: "MDX-native note-taking PWA",
        id: "/",
        theme_color: "#FAFAFA",
        background_color: "#FAFAFA",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        shortcuts: [
          { name: "New note", short_name: "New", url: "/?action=new", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
          { name: "Pair device", short_name: "Pair", url: "/?view=profile", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
        ],
        share_target: {
          action: "/",
          method: "GET",
          params: { title: "share_title", text: "share_text", url: "share_url" },
        },
        protocol_handlers: [
          { protocol: "web+notico", url: "/?shared=%s" },
        ],
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: "/offline.html",
        navigateFallbackAllowlist: [/^(?!\/api)/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.convex\.site\/.*/i,
            handler: "NetworkFirst",
            options: { cacheName: "convex-api", expiration: { maxEntries: 100, maxAgeSeconds: 86400 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts-webfonts", expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
});
