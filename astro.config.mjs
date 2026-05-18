import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  vite: {
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
    optimizeDeps: {
      entries: ["./src/**/*.{astro,ts,js}", "!./src/legacy/**/*"],
    },
  },
})
