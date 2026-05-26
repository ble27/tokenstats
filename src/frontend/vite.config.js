import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Load .env, .env.local, etc. from src/frontend/ (Vite default)
  envDir: '.',
  envPrefix: 'VITE_',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});