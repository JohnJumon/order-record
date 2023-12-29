import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/frontend/', // Specify the base path for deployment
  build: {
    outDir: 'dist', // Specify the output directory for the build
    assetsDir: 'assets', // Specify the assets directory for the build
    sourcemap: true, // Enable source maps for debugging
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
})
