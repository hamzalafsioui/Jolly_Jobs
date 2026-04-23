import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // Bind to all interfaces so Docker can expose port 5173
    host: '0.0.0.0',
    port: 5173,

    // HMR: browser should connect back via localhost (not the container hostname)
    hmr: {
      host: 'localhost',
      port: 5173,
    },

    // Polling is required for file watching on Docker volume mounts (Windows/WSL)
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
})

