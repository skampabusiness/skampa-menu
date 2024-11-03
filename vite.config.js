import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    'process.env': {}
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash']
        }
      }
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    sourcemap: true,
    assetsInlineLimit: 4096,
    emptyOutDir: true,
    target: 'esnext',
    // Optimize chunks
    modulePreload: {
      polyfill: true
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lodash']
  }
});