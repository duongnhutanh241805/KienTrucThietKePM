import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/users': { target: 'http://localhost:8081', rewrite: (p) => p.replace('/api/users', '') },
      '/api/movies': { target: 'http://localhost:8082', rewrite: (p) => p.replace('/api/movies', '') },
      '/api/bookings': { target: 'http://localhost:8083', rewrite: (p) => p.replace('/api/bookings', '') },
      '/api/notifications': { target: 'http://localhost:8085', rewrite: (p) => p.replace('/api/notifications', '') },
    }
  }
})
