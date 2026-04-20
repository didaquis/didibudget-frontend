import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from '@vitejs/plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    nodePolyfills({
      globals: {
        global: true,
        process: true,
        Buffer: true,
      },
    }),
  ],
  server: {
    port: 3000,
    open: false,
    cors: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          apollo: ['@apollo/client'],
          router: ['react-router-dom'],
          reactstrap: ['reactstrap'],
        },
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})