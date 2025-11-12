import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Enable Buffer polyfill
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Include specific polyfills
      buffer: true,
    }),
  ],
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'], // Prefer .jsx over .tsx
  },
  optimizeDeps: {
    exclude: ['src/components/mobile'], // Exclude mobile components from optimization
  },
  build: {
    rollupOptions: {
      // Exclude problematic mobile .tsx files from build
      external: (id) => {
        // Don't externalize, but we can filter
        return false;
      },
    },
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          wallet: ['web3', 'tronweb'],
          charts: ['chart.js', 'chartjs-plugin-datalabels'],
        },
      },
      // Exclude problematic TypeScript files from mobile components
      external: [],
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
})
