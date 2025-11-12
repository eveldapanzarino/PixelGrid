import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listens on 0.0.0.0
    port: 8080, // match DigitalOcean health check
    allowedHosts: [
      'pixelgrid-furb8.ondigitalocean.app',
      'localhost'
    ]
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: [
      'pixelgrid-furb8.ondigitalocean.app',
      'localhost'
    ]
  }
});
