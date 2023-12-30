import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
    VITE_BASE_URL: process.env.VITE_BASE_URL,
    VITE_BUCKET_NAME: process.env.VITE_BUCKET_NAME,
  },
})
