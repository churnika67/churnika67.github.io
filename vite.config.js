import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// churnika67.github.io is a user site, so the base path is "/".
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'postprocessing'],
          gsap: ['gsap', 'lenis'],
        },
      },
    },
  },
})
