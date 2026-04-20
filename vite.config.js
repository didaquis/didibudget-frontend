import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],
  esbuild: {
    include: /\.jsx?$/,
    loader: 'jsx',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  server: {
    port: 3000,
    open: false,
    cors: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    commonjsOptions: {
      include: /node_modules/,
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})