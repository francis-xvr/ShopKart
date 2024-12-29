import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: 'ShopKart',
  build: {
    outDir: './docs',
    rollupOptions: {
      input: {
        main: './index.html',
        collection: './collections.html',
      }
    }
  }
})
