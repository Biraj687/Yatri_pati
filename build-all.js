#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to copy files recursively
function copyDirSync(src, dest) {
  // Create destination folder if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source folder
  const files = fs.readdirSync(src);

  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    const stat = fs.statSync(srcFile);

    if (stat.isDirectory()) {
      // Recursively copy subdirectories
      copyDirSync(srcFile, destFile);
    } else {
      // Copy file
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

// Build main app
console.log('Building main app...');
execSync('npm run build', { cwd: __dirname, stdio: 'inherit' });

// Build dashboard
console.log('\nBuilding dashboard...');
execSync('npm run build', { cwd: path.join(__dirname, 'dashboard'), stdio: 'inherit' });

// Copy dashboard dist to main dist/dashboard
console.log('\nCopying dashboard to dist/dashboard...');
const dashboardDistSrc = path.join(__dirname, 'dashboard', 'dist');
const dashboardDistDest = path.join(__dirname, 'dist', 'dashboard');

// Remove existing dashboard directory if it exists
if (fs.existsSync(dashboardDistDest)) {
  fs.rmSync(dashboardDistDest, { recursive: true });
}

copyDirSync(dashboardDistSrc, dashboardDistDest);
console.log('Build complete!');
