import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'
import { tailwindWatch } from './vite-plugin-tailwind-watch'

export default defineConfig({
  plugins: [cloudflare(), ssrPlugin(), tailwindWatch()],
  build: {
    rollupOptions: {
      input: {
        main: './src/index.tsx',
        'yusuke-modal': './src/client/yusuke-modal.tsx',
        'yusuke-tabs': './src/client/yusuke-tabs.tsx',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'yusuke-modal' || chunkInfo.name === 'yusuke-tabs'
            ? 'client/[name].js'
            : '[name].js'
        },
      },
    },
  },
})

