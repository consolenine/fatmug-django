import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, 'api/')
      },
      '/media': {
        target: 'http://backend:8000',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/media/, 'media/')
      }
    }
  }
})