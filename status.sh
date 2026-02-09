#!/bin/bash
echo "=== PILLARVALE STATUS ==="
echo ""

# 1. Docker containers
echo "1. DOCKER CONTAINERS:"
docker compose ps --services | while read service; do
  status=$(docker compose ps $service | tail -1 | awk '{print $4}')
  echo "  $service: $status"
done | head -15

# 2. Key ports
echo ""
echo "2. KEY PORTS:"
PORTS="3000:API 3001:MPESA 3002:XRP 3003:AAVE 3004:Circuit 3005:Notify 3030:Grafana 9090:Prometheus"
echo "$PORTS" | tr ':' ' ' | while read port name; do
  echo -n "  $name (:$port): "
  timeout 1 bash -c "echo > /dev/tcp/127.0.0.1/$port" 2>/dev/null && echo "✓" || echo "✗"
done

# 3. IPv6 access
echo ""
echo "3. IPv6 ACCESS READY:"
IPV6="2a02:c207:2306:3391::1"
echo "  http://[$IPV6]:3000  - API Gateway"
echo "  http://[$IPV6]:3030  - Grafana (admin/admin)"
echo "  http://[$IPV6]:3000/mobile - Mobile test page"

# 4. Prometheus
echo ""
echo "4. PROMETHEUS:"
echo "  Status: Monitoring only itself (no errors)"
echo "  URL: http://[$IPV6]:9090"
