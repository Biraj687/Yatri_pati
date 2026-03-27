import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import os from 'os';
// Get local IP address for network access
function getLocalIP() {
    var interfaces = os.networkInterfaces();
    for (var _i = 0, _a = Object.keys(interfaces); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        var ifaces = interfaces[name_1] || [];
        for (var _b = 0, ifaces_1 = ifaces; _b < ifaces_1.length; _b++) {
            var iface = ifaces_1[_b];
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}
export default defineConfig({
    plugins: [
        react(),
        {
            name: 'print-network-info',
            apply: 'serve',
            configureServer: function (server) {
                return function () {
                    var _a;
                    (_a = server.httpServer) === null || _a === void 0 ? void 0 : _a.once('listening', function () {
                        var port = 5174;
                        var localIP = getLocalIP();
                        setTimeout(function () {
                            console.clear();
                            console.log('\n');
                            console.log('  \x1b[32m╔════════════════════════════════════════╗\x1b[0m');
                            console.log('  \x1b[32m║     YATRIPATI DASHBOARD SERVER          \x1b[32m║\x1b[0m');
                            console.log('  \x1b[32m╚════════════════════════════════════════╝\x1b[0m');
                            console.log('\n');
                            console.log('  \x1b[36m✓ Local Development\x1b[0m');
                            console.log("    \u2192 http://localhost:".concat(port, "\u001B[0m"));
                            console.log('\n');
                            console.log('  \x1b[36m✓ Network Access (same WiFi/LAN)\x1b[0m');
                            console.log("    \u2192 http://".concat(localIP, ":").concat(port, "\u001B[0m"));
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
        open: true,
        middlewareMode: false,
    },
});
