const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const PORT = 3456;
const WEREAD_API_KEY = process.env.WEREAD_API_KEY || '';
const HTML_FILE = path.join(__dirname, 'ai-reading-companion.html');
const PID_FILE = path.join(__dirname, '.server.pid');

// 微信读书网关仅代理文档声明的三个只读接口，其余一律拒绝
const ALLOWED_APIS = {
  '/store/search': ['keyword', 'count'],
  '/book/bestbookmarks': ['bookId', 'chapterUid', 'synckey'],
  '/book/info': ['bookId'],
};

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
  req.on('data', chunk => {
    body += chunk;
    if (body.length > 64 * 1024) { req.destroy(); }
  });
  req.on('end', () => {
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ errcode: -1, errmsg: '请求体不是合法 JSON' }));
    }

    const apiName = parsed.api_name;
    if (!Object.prototype.hasOwnProperty.call(ALLOWED_APIS, apiName)) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ errcode: -1, errmsg: `不允许的接口: ${apiName}` }));
    }

    // 只透传白名单内的字段
    const payload = { api_name: apiName };
    for (const field of ALLOWED_APIS[apiName]) {
      if (parsed[field] !== undefined) payload[field] = parsed[field];
    }
    payload.skill_version = '1.1.2';

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
        res.writeHead(pres.statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(data);
      });
    });

    proxy.on('error', err => {
      res.writeHead(502);
      res.end(JSON.stringify({ errcode: -1, errmsg: '微信读书接口不可达: ' + err.message }));
    });

    proxy.write(JSON.stringify(payload));
    proxy.end();
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // 页面与 /api/weread 同源，无需跨域；不再设置通配 CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (url.pathname === '/api/weread' && req.method === 'POST') {
    return proxyWeread(req, res);
  }

  if (url.pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, weread: !!WEREAD_API_KEY }));
  }

  // 仅提供静态文件，且不允许路径穿越出本目录
  const safeRoot = __dirname + path.sep;
  let filePath = url.pathname === '/' ? HTML_FILE : path.join(__dirname, url.pathname);
  if (!path.resolve(filePath).startsWith(safeRoot)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveFile(res, filePath);
  }

  res.writeHead(404);
  res.end('Not Found');
});

// 只监听本机回环地址，避免局域网内其他机器访问带凭据的代理
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`AI 伴读服务已启动 → ${url}（仅监听本机 ${HOST}）`);
  console.log(`微信读书 API: ${WEREAD_API_KEY ? '✓ 已配置' : '✗ 未配置'}`);

  // 记录 PID，供 start.sh/stop.sh 精确管理本进程
  try { fs.writeFileSync(PID_FILE, String(process.pid)); } catch {}

  const shutdown = () => {
    try { fs.unlinkSync(PID_FILE); } catch {}
    process.exit(0);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // 自动打开浏览器：execFile + 参数数组，不经 shell，无命令拼接
  const platform = process.platform;
  const opener = platform === 'darwin' ? 'open'
    : platform === 'win32' ? 'cmd'
    : 'xdg-open';
  const args = platform === 'win32' ? ['/c', 'start', '', url] : [url];
  execFile(opener, args, err => {
    if (err) console.log('自动打开浏览器失败，请手动访问:', url);
  });
});
