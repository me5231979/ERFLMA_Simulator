import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works under any path (e.g. GitHub Pages project
  // site at /ERFLMA_Simulator/) as well as at a domain root. The app is a
  // single page with no client-side routing, so relative asset URLs are safe.
  base: './',
  plugins: [react()],
})
