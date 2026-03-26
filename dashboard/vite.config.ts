import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@context': path.resolve(__dirname, './src/context'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@services': path.resolve(__dirname, './src/services'),
      // Shared resources (backend-agnostic layer)
      '@shared/services': path.resolve(__dirname, '../shared/services'),
      '@shared/types': path.resolve(__dirname, '../shared/types'),
      '@shared/hooks': path.resolve(__dirname, '../shared/hooks'),
      '@shared/context': path.resolve(__dirname, '../shared/context'),
      '@shared/utils': path.resolve(__dirname, '../shared/utils'),
      '@shared/mocks': path.resolve(__dirname, '../shared/mocks'),
    },
  },
  server: {
    port: 5174,
    strictPort: false,
  },
})
