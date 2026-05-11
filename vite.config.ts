import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    tanstackStart({
      target: 'node',
    }),
    viteReact(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 4050,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  ssr: {
    noExternal: ['@tanstack/react-router', '@tanstack/react-start'],
    external: ['bun:sqlite'],
  },
  optimizeDeps: {
    exclude: ['bun:sqlite', 'knex'],
  },
})
