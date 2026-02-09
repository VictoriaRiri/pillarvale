const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 8080;

const services = [
  { name: 'api_gateway', url: 'http://api-gateway:3000/health' },
  { name: 'mpesa_service', url: 'http://mpesa-service:3001/health' },
  { name: 'xrp_settlement', url: 'http://xrp-settlement:3002/health' },
  { name: 'aave_manager', url: 'http://aave-manager:3003/health' },
  { name: 'circuit_breaker', url: 'http://circuit-breaker:3004/health' },
  { name: 'notification_service', url: 'http://notification-service:3005/health' }
];

app.get('/metrics', async (req, res) => {
  let metrics = '# HELP service_health Service health status (1=healthy, 0=unhealthy)\n';
  metrics += '# TYPE service_health gauge\n';

  for (const service of services) {
    try {
      const response = await fetch(service.url, { timeout: 5000 });
      const data = await response.json();
      const isHealthy = data.status === 'healthy' ? 1 : 0;
      metrics += `service_health{service="${service.name}"} ${isHealthy}\n`;
    } catch (error) {
      metrics += `service_health{service="${service.name}"} 0\n`;
    }
  }

  res.set('Content-Type', 'text/plain');
  res.send(metrics);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Health exporter running on port ${PORT}`);
});
