import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'
import { tailwindWatch } from './vite-plugin-tailwind-watch'

export default defineConfig({
  plugins: [cloudflare(), ssrPlugin(), tailwindWatch()],
  build: {
    rollupOptions: {
      input: './src/index.tsx',
    },
  },
})

