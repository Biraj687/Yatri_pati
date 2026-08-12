import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import os from 'os'

// Get local IP address for network access
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const ifaces = interfaces[name] || [];
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const dashboardBasePath = env.VITE_DASHBOARD_BASEPATH || '/dashboard';
  const base = dashboardBasePath.endsWith('/') ? dashboardBasePath : `${dashboardBasePath}/`;

  return {
    base,
    plugins: [
      react(),
      {
        name: 'redirect-dashboard',
        enforce: 'pre',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === dashboardBasePath || req.originalUrl === dashboardBasePath) {
              res.statusCode = 301;
              res.setHeader('Location', `${dashboardBasePath}/`);
              res.end();
              return;
            }
            next();
          });
        }
      },
      {
        name: 'print-network-info',
        apply: 'serve',
        configureServer(server) {
          return () => {
            server.httpServer?.once('listening', () => {
              const port = 5174;
              const localIP = getLocalIP();
              const pathSuffix = base;
              
              setTimeout(() => {
                console.clear();
                console.log('\n');
                console.log('  \x1b[32m╔════════════════════════════════════════╗\x1b[0m');
                console.log('  \x1b[32m║     NEPAL EXPLAIN DASHBOARD SERVER       \x1b[32m║\x1b[0m');
                console.log('  \x1b[32m╚════════════════════════════════════════╝\x1b[0m');
                console.log('\n');
                console.log('  \x1b[36m✓ Local Development\x1b[0m');
                console.log(`    → http://localhost:${port}${pathSuffix}\x1b[0m`);
                console.log('\n');
                console.log('  \x1b[36m✓ Network Access (same WiFi/LAN)\x1b[0m');
                console.log(`    → http://${localIP}:${port}${pathSuffix}\x1b[0m`);
                console.log('\n');
                console.log('  \x1b[33m⚡ HMR enabled for hot module reloading\x1b[0m');
                console.log('  \x1b[33m✎  Press q to quit\x1b[0m\n');
              }, 300);
            });
          };
        },
      }
    ],
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
    host: '0.0.0.0',
    open: base,
    middlewareMode: false,
  },
  };
})
