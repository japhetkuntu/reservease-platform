import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'ReservEase Owner Portal',
        short_name: 'ReservEase Owners',
        description: 'Manage your property listings and tenant requests on ReservEase.',
        theme_color: '#002244',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: [
      { find: "@/components/ui", replacement: path.resolve(__dirname, "../../packages/ui/src/components/ui") },
      { find: "@/lib", replacement: path.resolve(__dirname, "../../packages/ui/src/lib") },
      { find: "@", replacement: path.resolve(__dirname, "./src") }
    ],
  },
})
