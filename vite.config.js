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
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
})
