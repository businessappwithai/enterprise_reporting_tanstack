import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    tanstackStart(),
    viteReact(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  server: {
    port: 4050,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  ssr: {
    noExternal: ['@tanstack/react-router', '@tanstack/react-start', /^@radix-ui/],
    // better-auth must NOT be bundled into the server build.
    //
    // It depends on zod ^4, this application on zod ^3, and both are installed
    // — v4 nested under better-auth, v3 hoisted. Node's resolution gets that
    // right; the bundler flattens it and hands better-auth the hoisted v3,
    // which fails at runtime on `z.looseObject is not a function` — a 500 on
    // every sign-in, from a build that succeeded and a typecheck that passed.
    // Leaving it external keeps the nested resolution that works.
    external: ['better-auth'],
  },
})
