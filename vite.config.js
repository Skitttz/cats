import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: true,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
  build: {
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          tf: [
            '@tensorflow/tfjs-core',
            '@tensorflow/tfjs-converter',
            '@tensorflow/tfjs-backend-cpu',
            '@tensorflow/tfjs-backend-webgl',
            '@tensorflow-models/coco-ssd',
          ],
        },
      },
    },
  },
});
