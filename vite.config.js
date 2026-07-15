import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  envPrefix: ['VITE_', 'GOOGLE_'],
  base: process.env.VITE_BASE_PATH || "/fact",

});


