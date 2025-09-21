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
  define: {
    global: 'globalThis',
  },
  build: {
    outDir: 'dist',
    commonjsOptions: {
      include: [/long/, /node_modules/],
      transformMixedEsModules: true,
    },
    transformMixedEsModules: true,
    cssMinify: true,
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      cache: false,
      maxParallelFileOps: 2,
      output: {
        sourcemap: false,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const packageName = id.toString().split('node_modules/')[1];
            if (!packageName) return 'vendor';
            const firstDir = packageName.split('/')[0];
            const largePackages = [
              '@tensorflow',
              'victory',
              'emoji-picker-react',
              'socket.io',
              'lucide-react',
            ];
            if (largePackages.some((pkg) => firstDir.includes(pkg))) {
              return `vendor-${firstDir}`;
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  optimizeDeps: {
    include: [
      'long',
      '@tensorflow/tfjs-core',
      '@tensorflow/tfjs-backend-cpu',
      '@tensorflow/tfjs-backend-webgl',
      '@tensorflow/tfjs-converter',
      '@tensorflow-models/coco-ssd',
    ],
    exclude: ['victory'],
    entries: ['./src/main.jsx', './src/App.jsx'],
    esbuildOptions: {
      target: 'esnext',
      supported: { 'top-level-await': true },
    },
  },
});
