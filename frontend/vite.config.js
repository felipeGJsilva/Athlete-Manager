import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

const API_URL = process.env.VITE_API_URL || process.env.API_URL || 'http://127.0.0.1:8000'

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar()
  ],
  server: {
    port: 5173,
    proxy: {
      // Proxy `/api` and `/auth` requests to backend running in the devcontainer
      '/api': {
        target: API_URL,
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: API_URL,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
