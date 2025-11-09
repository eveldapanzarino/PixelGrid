import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // this is what Netlify will publish
  },
  server: {
    allowedHosts: ['devserver-main--react-grid-responsive-graphics-render.netlify.app'], // optional fix for your earlier error
  },
})
