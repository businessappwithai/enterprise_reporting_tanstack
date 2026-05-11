import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const clientDir = join(__dirname, 'dist/client');

const mimeTypes = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.html': 'text/html',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const { default: server } = await import('./dist/server/server.js');

const httpServer = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  
  if (pathname.startsWith('/assets/') || pathname === '/favicon.ico') {
    const filePath = join(clientDir, pathname);
    if (existsSync(filePath)) {
      const ext = extname(filePath);
      const ct = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': ct, 'Cache-Control': 'public, max-age=31536000' });
      res.end(readFileSync(filePath));
      return;
    }
  }
  
  const request = new Request(`http://localhost${req.url}`, {
    method: req.method,
    headers: Object.fromEntries(Object.entries(req.headers).filter(([, v]) => v !== undefined)),
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', c => chunks.push(c));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    }),
  });
  
  try {
    const response = await server.fetch(request);
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    const buffer = await response.arrayBuffer();
    res.end(Buffer.from(buffer));
  } catch (e) {
    console.error(e);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

httpServer.listen(4050, () => console.log('Production server: http://localhost:4050'));
