import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

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
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
