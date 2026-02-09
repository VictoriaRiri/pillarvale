import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Metrics endpoint for Prometheus
app.get('/metrics', (req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'healthy',
    requests_served: 0, // You can add request counting logic
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'running',
    version: '1.0.0',
    endpoints: [
      { path: '/', method: 'GET', description: 'Service status' },
      { path: '/health', method: 'GET', description: 'Health check' },
      { path: '/metrics', method: 'GET', description: 'Prometheus metrics' },
      { path: '/mobile', method: 'GET', description: 'Mobile test page' }
    ],
    timestamp: new Date().toISOString()
  });
});

// Mobile test page
app.get('/mobile', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PillarVale Mobile Test</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .service { margin: 10px 0; padding: 15px; border: 1px solid #ddd; }
        button { padding: 10px; margin: 5px; }
      </style>
    </head>
    <body>
      <h1>PillarVale Mobile Test</h1>
      <div id="services"></div>
      <script>
        const services = [
          { name: 'API Gateway', port: 3000 },
          { name: 'MPESA Service', port: 3001 },
          { name: 'XRP Settlement', port: 3002 },
          { name: 'Aave Manager', port: 3003 },
          { name: 'Circuit Breaker', port: 3004 },
          { name: 'Notification Service', port: 3005 }
        ];
        async function testService(service) {
          try {
            const res = await fetch('http://' + window.location.hostname + ':' + service.port);
            return res.ok;
          } catch { return false; }
        }
        async function checkAll() {
          const container = document.getElementById('services');
          container.innerHTML = '';
          for (const service of services) {
            const isOnline = await testService(service);
            const div = document.createElement('div');
            div.className = 'service';
            div.style.background = isOnline ? '#d4edda' : '#f8d7da';
            div.innerHTML = \`
              <h3>\${service.name}</h3>
              <p>Port: \${service.port}</p>
              <p>Status: \${isOnline ? '✅ Online' : '❌ Offline'}</p>
              <button onclick="window.open('http://' + window.location.hostname + ':' + \${service.port}, '_blank')">
                Open \${service.name}
              </button>
            \`;
            container.appendChild(div);
          }
        }
        checkAll();
      </script>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, '::', () => {
  console.log(\`API Gateway running on port \${PORT}\`);
  console.log(\`Health: http://localhost:\${PORT}/health\`);
  console.log(\`Mobile test: http://localhost:\${PORT}/mobile\`);
});
