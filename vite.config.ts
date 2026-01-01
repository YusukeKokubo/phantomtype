import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'
import { tailwindWatch } from './vite-plugin-tailwind-watch'

export default defineConfig({
  plugins: [cloudflare(), ssrPlugin(), tailwindWatch()],
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: './src/index.tsx',
        'yusuke-client': './src/yusuke/client/yusuke-client.tsx',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'yusuke-client'
            ? 'client/[name].js'
            : '[name].js'
        },
      },
    },
  },
})

