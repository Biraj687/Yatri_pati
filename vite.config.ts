import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }): UserConfig => ({
  plugins: [
    react(),
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean) as any[],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@context': fileURLToPath(new URL('./src/context', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
      '@dashboard': fileURLToPath(new URL('./dashboard/src', import.meta.url)),
      // Shared resources (backend-agnostic layer)
      '@shared/services': fileURLToPath(new URL('./shared/services', import.meta.url)),
      '@shared/types': fileURLToPath(new URL('./shared/types', import.meta.url)),
      '@shared/hooks': fileURLToPath(new URL('./shared/hooks', import.meta.url)),
      '@shared/context': fileURLToPath(new URL('./shared/context', import.meta.url)),
      '@shared/utils': fileURLToPath(new URL('./shared/utils', import.meta.url)),
      '@shared/mocks': fileURLToPath(new URL('./shared/mocks', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'terser' : false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  envPrefix: 'VITE_',
}))
