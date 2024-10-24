import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  port:5173,
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001'
      }
    }
  }
})