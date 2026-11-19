import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['apple-touch-icon.png', 'icon-192.png', 'icon-512.png'],
    manifest: {
      name: 'Goal Ticker',
      short_name: 'Goal Ticker',
      theme_color: '#121212',
      background_color: '#121212',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/TOLSFTI-1.0/',
      scope: '/TOLSFTI-1.0/',
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
  base: '/TOLSFTI-1.0/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})