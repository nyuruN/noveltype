import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // relative paths (fix GH Pages)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
