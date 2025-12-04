import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// Demo 2 Config - Smart Editor Version
export default defineConfig({
  plugins: [vue()],
  root: resolve(__dirname, 'demo2'),
  publicDir: resolve(__dirname, 'public'),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5176, // Different port than demo1
  },
  build: {
    outDir: resolve(__dirname, 'docs'), // Same output for GitHub Pages
    emptyOutDir: true,
  },
});
