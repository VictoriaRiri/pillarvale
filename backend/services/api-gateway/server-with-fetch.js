const http = require('http');
const fetch = require('node-fetch');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  
  if (req.url === '/backend-health') {
    const health = {
      timestamp: new Date().toISOString(),
      services: {},
      databases: { postgres: 'running', redis: 'running' },
      overall: 'healthy'
    };

    const services = [
      { name: 'mpesa-service', port: 3001 },
      { name: 'xrp-settlement', port: 3002 },
      { name: 'aave-manager', port: 3003 },
      { name: 'circuit-breaker', port: 3004 },
      { name: 'notification-service', port: 3005 }
    ];

    for (const service of services) {
      try {
        const response = await fetch(`http://${service.name}:${service.port}/health`, { timeout: 2000 });
        health.services[service.name] = response.ok ? 'healthy' : 'unhealthy';
      } catch (error) {
        health.services[service.name] = 'unreachable';
        health.overall = 'degraded';
      }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(health));
  }
  
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'healthy', service: 'api-gateway' }));
  }
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    service: 'api-gateway',
    status: 'running',
    timestamp: new Date().toISOString(),
    message: 'PillarVale API Gateway',
    endpoints: ['/', '/health', '/backend-health', '/mobile']
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API Gateway running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
});
