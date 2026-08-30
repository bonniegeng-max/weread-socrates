const { exec } = require('child_process');

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const WEREAD_API_KEY = process.env.WEREAD_API_KEY || '';
const HTML_FILE = path.join(__dirname, 'ai-reading-companion.html');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  });
  fs.createReadStream(filePath).pipe(res);
}

function proxyWeread(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const payload = JSON.parse(body);
    payload.skill_version = '1.0.4';

    const options = {
      hostname: 'i.weread.qq.com',
      path: '/api/agent/gateway',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEREAD_API_KEY}`,
      },
    };

    const proxy = https.request(options, pres => {
      let data = '';
      pres.on('data', chunk => data += chunk);
      pres.on('end', () => {
        res.writeHead(pres.statusCode, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(data);
      });
    });

    proxy.on('error', err => {
      res.writeHead(502);
      res.end(JSON.stringify({ errocode: -1, errmsg: '微信读书接口不可达: ' + err.message }));
    });

    proxy.write(JSON.stringify(payload));
    proxy.end();
  });
}

const server = http.createServer((req, res) => {
  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/weread' && req.method === 'POST') {
    return proxyWeread(req, res);
  }

  if (url.pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, weread: !!WEREAD_API_KEY }));
  }

  // Serve static files
  const filePath = url.pathname === '/' ? HTML_FILE : path.join(__dirname, url.pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveFile(res, filePath);
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`AI 伴读服务已启动 → ${url}`);
  console.log(`微信读书 API: ${WEREAD_API_KEY ? '✓ 已配置' : '✗ 未配置'}`);

  // Auto-open browser on macOS
  const platform = process.platform;
  const cmd = platform === 'darwin' ? `open ${url}` :
              platform === 'win32' ? `start ${url}` :
              `xdg-open ${url}`;
  exec(cmd, (err) => {
    if (err) console.log('自动打开浏览器失败，请手动访问:', url);
  });
});
