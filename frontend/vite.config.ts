import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    define: {
      SERVER_BASE_URL: JSON.stringify(env.SERVER_BASE_URL),
      BUCKET_NAME: JSON.stringify(env.BUCKET_NAME),
    },
  };
});