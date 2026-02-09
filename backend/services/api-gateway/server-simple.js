const express = require('express');
const app = express();
const PORT = 3000;

// API key authentication
const VALID_API_KEYS = ['pillarvale-api-key-2024'];

const apiKeyAuth = (req, res, next) => {
  const publicRoutes = ['/', '/health'];
  if (publicRoutes.includes(req.path)) return next();
  
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

app.use('/api', apiKeyAuth);

app.get('/', (req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'running',
    message: 'PillarVale Financial Platform',
    auth: 'Use x-api-key: pillarvale-api-key-2024 for /api routes'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/data', (req, res) => {
  res.json({
    message: 'Protected data accessed',
    data: { user: 'authenticated', access: 'granted' }
  });
});

app.listen(PORT, () => {
  console.log(`✅ API Gateway running on port ${PORT}`);
});
