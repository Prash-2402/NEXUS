import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/frames/**', '**/dist/**'],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three'],
          animation: ['framer-motion', 'gsap'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
