import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  plugins: [react(), VitePWA({
    register: true,
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon.svg'],
    manifest: {
      name: 'Goal Ticker',
      short_name: 'Goal Ticker',
      theme_color: '#121212',
      background_color: '#121212',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: 'icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})