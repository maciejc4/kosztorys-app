import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/kosztorys-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Kosztorys Budowlany',
        short_name: 'Kosztorys',
        description: 'Aplikacja do szybkiego kosztorysowania dla firm wykończeniowych',
        theme_color: '#f97316',
        background_color: '#1f2937',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/kosztorys-app/',
        start_url: '/kosztorys-app/',
        icons: [
          {
            src: '/kosztorys-app/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/kosztorys-app/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/kosztorys-app/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          pdf: ['jspdf']
        }
      }
    }
  }
})
