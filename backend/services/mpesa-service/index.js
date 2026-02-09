const http = require('http');
const PORT = process.env.PORT || 3000;
const SERVICE_NAME = "mpesa-service";

const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: SERVICE_NAME,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
    return;
  }
  
  if (req.url === '/' || req.url === '') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: SERVICE_NAME,
      status: 'running',
      endpoints: ['/', '/health', '/metrics'],
      port: PORT,
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found', service: SERVICE_NAME }));
});

server.listen(PORT, '::', () => {
  console.log(`${SERVICE_NAME} running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
});
