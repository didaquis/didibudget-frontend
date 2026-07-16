import { defineConfig, transformWithOxc } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 8 bundles with Rolldown/Oxc, which infers the loader from the file
// extension and dropped esbuild's loader-by-regex option. Since this project
// keeps JSX inside `.js` files, this pre-plugin transforms them as JSX (using
// React's automatic runtime, matching @vitejs/plugin-react) before the rest of
// the pipeline sees them. @vitejs/plugin-react still handles Fast Refresh.
// See https://github.com/vitejs/vite/discussions/21505
const jsxInJs = () => {
  let isProduction = false
  return {
    name: 'jsx-in-js',
    enforce: 'pre',
    configResolved(config) {
      isProduction = config.isProduction
    },
    transform(code, id) {
      if (!/src\/.*\.js$/.test(id)) {
        return null
      }
      return transformWithOxc(code, id, {
        lang: 'jsx',
        jsx: { runtime: 'automatic', development: !isProduction },
      })
    },
  }
}

export default defineConfig({
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: {
        '.js': 'jsx',
      },
    },
  },
  plugins: [
    jsxInJs(),
    react(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.js',
    env: {
      TZ: 'Europe/Madrid',
    },
  },
})
