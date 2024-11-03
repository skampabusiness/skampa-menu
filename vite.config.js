import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Correct for custom domain
  define: {
    'process.env': {}
  },
  build: {
    // Optimize chunk size and loading
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash']
        }
      }
    },
    // Split CSS for better caching
    cssCodeSplit: true,
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 500,
    // Generate source maps for production
    sourcemap: true,
    // Optimize assets
    assetsInlineLimit: 4096,
    // Clean the output directory before build
    emptyOutDir: true,
    // Improve build performance
    target: 'esnext'
  },
  // Development server settings
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  // Preview settings
  preview: {
    port: 4173,
    open: true
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'lodash']
  }
});