const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'running',
    message: 'PillarVale Financial Platform',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/api/data', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === 'pillarvale-api-key-2024') {
    res.json({ message: 'Access granted', data: { transaction: 'complete' } });
  } else {
    res.status(401).json({ error: 'Invalid API key' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API Gateway running on port ${PORT}`);
});
