import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import eslint from "vite-plugin-eslint"
import istanbul from "vite-plugin-istanbul"
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
    istanbul({
      include: "src/*",
      exclude: ["node_modules", "test/"],
      extension: [".js", ".ts", ".jsx", ".tsx"],
      requireEnv: true,
    }),
    VitePWA({
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "Pollee",
        short_name: "pollee",
        description: "Need help? we've got your back",
        icons: [
          {
            src: "/pwa-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        theme_color: "#2196f3",
        background_color: "#ffffff",
        display: "standalone",
      },
      registerType: "autoUpdate",
      workbox: {
        sourcemap: true,
        maximumFileSizeToCacheInBytes: 4000000,
      },
    }),
  ],
  server: {
    port: 3001,
  },
  define: {
    "process.env": {},
  },
})
