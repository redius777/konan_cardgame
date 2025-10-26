/**
 * 名探偵コナンTCG - 簡易WEBサーバー
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // デフォルトはgame.html
    let filePath = req.url === '/' ? '/game.html' : req.url;
    filePath = path.join(__dirname, filePath);

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(80));
    console.log('🎮 名探偵コナン トレーディングカードゲーム - WEBサーバー起動');
    console.log('='.repeat(80));
    console.log();
    console.log(`サーバーが起動しました！`);
    console.log();
    console.log(`アクセス方法:`);
    console.log(`  ローカル: http://localhost:${PORT}`);
    console.log(`  ネットワーク: http://0.0.0.0:${PORT}`);
    console.log();
    console.log('ブラウザで上記URLを開いてゲームをプレイしてください！');
    console.log();
    console.log('サーバーを停止するには Ctrl+C を押してください');
    console.log('='.repeat(80));
});
