import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import { validateEnvironment } from './config/env.schema.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  validateEnvironment(env, mode);

  return {
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
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Cats - Rede social para gatos',
        short_name: 'Cats',
        description: 'Cats - Rede social para gatos.',
        lang: 'pt-BR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#f4762b',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        // O chunk vendor beira 1,85 MB e o teto padrão do workbox é 2 MB — sem
        // isso ele sairia do precache em silêncio ao crescer mais um pouco.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/json\//, /^\/socket\.io\//],
        runtimeCaching: [
          {
            // Nada autenticado pode encostar em cache.
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/json/') ||
              url.pathname.startsWith('/socket.io/'),
            handler: 'NetworkOnly',
          },
          {
            // Fotos do chat. A resposta é opaca (outra origem, sem CORS): serve
            // para reexibição rápida, não para inspeção de status.
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/wp-content/uploads/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'cats-chat-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
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
      'victory',
    ],
    entries: ['./src/main.jsx', './src/App.jsx'],
    esbuildOptions: {
      target: 'esnext',
      supported: { 'top-level-await': true },
    },
    build: {
      target: 'esnext',
    },
  },
  };
});
