const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple API key authentication
const VALID_API_KEYS = ['pillarvale-api-key-2024', 'mobile-app-key', 'web-app-key'];

const apiKeyAuth = (req, res, next) => {
  // Skip auth for public routes
  const publicRoutes = ['/', '/health', '/backend-health', '/mobile'];
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Valid API key required',
      hint: 'Add header: x-api-key: pillarvale-api-key-2024'
    });
  }
  
  next();
};

// Use auth middleware for all API routes
app.use('/api', apiKeyAuth);

// Routes
app.get('/', (req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'running',
    message: 'PillarVale API Gateway',
    authentication: 'API key required for /api routes',
    example: 'Use header: x-api-key: pillarvale-api-key-2024'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    service: 'api-gateway',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/mobile', (req, res) => {
  res.json({
    message: 'Mobile endpoint',
    status: 'active',
    endpoints: {
      auth: '/api/auth/login',
      health: '/health',
      api: 'Use x-api-key header'
    }
  });
});

// Protected API route example
app.get('/api/data', (req, res) => {
  res.json({
    message: 'Protected data accessed successfully',
    data: { transaction: 'completed', amount: 1000 },
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ API Gateway running on port ${PORT}`);
});
