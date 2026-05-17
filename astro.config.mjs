import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  integrations: [react()],
  output: 'static',
  trailingSlash: 'never',
  vite: {
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  },
})
