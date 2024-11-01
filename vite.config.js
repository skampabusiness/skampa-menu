import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Changed from '/skampa-menu/' to '/'
  define: {
    'process.env': {}
  }
})