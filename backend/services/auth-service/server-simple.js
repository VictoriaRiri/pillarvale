const express = require('express');
const app = express();
const PORT = 3006;

app.get('/', (req, res) => {
  res.json({
    service: 'auth-service',
    status: 'running',
    message: 'PillarVale Authentication',
    endpoints: ['/', '/health', '/api/auth/login', '/api/auth/register']
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Auth service running on port ${PORT}`);
});
