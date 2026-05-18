import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      entries: ["./src/**/*.{astro,ts,js}", "!./src/legacy/**/*"],
    },
  },
})
