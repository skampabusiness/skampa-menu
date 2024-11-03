import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Enable minification
    minify: 'esbuild',
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['lodash']
        },
        // Minimize chunk size
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
          const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
          return `assets/${fileName}/[name].[hash].js`;
        }
      }
    },
    // Improve build performance
    target: 'esnext',
    // Reduce initial bundle size
    cssCodeSplit: true,
    // Optimize assets
    assetsInlineLimit: 4096,
    // Enable compression
    reportCompressedSize: true,
    // Chunk size warnings
    chunkSizeWarningLimit: 500
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lodash'],
    exclude: [],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  // Enable caching
  server: {
    force: true,
    hmr: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  }
});