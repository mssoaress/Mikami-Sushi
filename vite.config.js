import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@firebase/firestore')) return 'firestore';
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) return 'firebase-core';
          if (id.includes('node_modules/react')) return 'react';
          return undefined;
        },
      },
    },
  },
})
