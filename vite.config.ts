import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'
import { clientManifestPlugin } from './vite-plugin-client-manifest'
import { tailwindWatch } from './vite-plugin-tailwind-watch'
import { devStaticPlugin } from './vite-plugin-dev-static'

export default defineConfig({
  plugins: [devStaticPlugin(), cloudflare(), ssrPlugin(), tailwindWatch(), clientManifestPlugin()],
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

