import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
  },
  base: '/',
});