const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: ['/', '/health', '/mobile']
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'api-gateway' });
});

app.get('/mobile', (req, res) => {
  res.send(`
    <h1>PillarVale Mobile</h1>
    <p>API Gateway is working!</p>
    <p>Server time: ${new Date().toISOString()}</p>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`API Gateway running on port \${PORT}\`);
});
