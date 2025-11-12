import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // listens on all interfaces
    port: 8080,
    strictPort: true,
    allowedHosts: ['pixelgrid-furb8.ondigitalocean.app', 'localhost']
  },
  preview: {
    host: true,
    port: 8080,
    strictPort: true,
    allowedHosts: ['pixelgrid-furb8.ondigitalocean.app', 'localhost']
  }
});

