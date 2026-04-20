import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import nodePolyfills from '@vitejs/plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        global: true,
        process: true,
        Buffer: true,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.js',
      ],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})