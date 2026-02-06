const http = require('http');
const PORT = 3001;

const requestHandler = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    service: 'mpesa-service',
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoint: req.url
  }));
};

const server = http.createServer(requestHandler);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`MPESA service listening on 0.0.0.0:${PORT}`);
});

// Make sure we handle errors
server.on('error', (err) => {
  console.error('Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is in use, trying ${PORT + 1}`);
    server.listen(PORT + 1, '0.0.0.0');
  }
});
