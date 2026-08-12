import os from 'os';
import colors from 'picocolors';

export function printNetworkLinksPlugin() {
  let configResolved = false;

  return {
    name: 'print-network-links',
    
    apply: 'serve',
    
    configResolved() {
      configResolved = true;
    },

    configureServer(server) {
      return () => {
        server.httpServer?.once('listening', () => {
          if (configResolved) {
            setTimeout(() => {
              printNetworkLinks();
            }, 100);
          }
        });
      };
    },
  };
}

function printNetworkLinks() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  // Get all IPv4 addresses
  Object.keys(interfaces).forEach(name => {
    interfaces[name]?.forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    });
  });

  console.log('\n');
  console.log(colors.green('  ➜  Dashboard Server is running at:\n'));
  console.log(colors.cyan(`  ➜  Local:   http://localhost:${process.env.VITE_PORT || 5174}`));
  
  if (addresses.length > 0) {
    addresses.forEach(address => {
      console.log(colors.cyan(`  ➜  Network: http://${address}:${process.env.VITE_PORT || 5174}`));
    });
  }

  console.log(colors.dim('\n  ➜  Press q to quit\n'));
}

export default printNetworkLinksPlugin;
