import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'], // Prefer .jsx over .tsx
  },
  build: {
    rollupOptions: {
      // Exclude problematic TypeScript files that have missing dependencies
      external: (id) => {
        // Don't externalize, but we can filter out problematic imports
        return false;
      },
    },
  },
})
