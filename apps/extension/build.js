const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const outdir = path.join(__dirname, 'dist');
if (!fs.existsSync(outdir)) fs.mkdirSync(outdir);

// Copy manifest and popup HTML
fs.copyFileSync(path.join(__dirname, 'manifest.json'), path.join(outdir, 'manifest.json'));
if (fs.existsSync(path.join(__dirname, 'popup.html'))) {
  fs.copyFileSync(path.join(__dirname, 'popup.html'), path.join(outdir, 'popup.html'));
}
// We skip icons if they don't exist, we'll patch manifest next

esbuild.build({
  entryPoints: ['src/content.ts', 'src/popup.ts'],
  bundle: true,
  outdir: 'dist',
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
  target: ['chrome100']
}).then(() => {
  console.log('Extension built successfully in /dist');
}).catch(() => process.exit(1));
