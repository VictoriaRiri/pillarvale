#!/bin/bash
echo "=== PILLARVALE SYSTEM STATUS ==="
echo "Time: $(date)"
echo ""

# 1. Docker containers
echo "1. DOCKER CONTAINERS:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "fx-|NAME"

# 2. Service health
echo ""
echo "2. SERVICE HEALTH:"
services=("3000:API Gateway" "3001:MPESA" "3002:XRP" "3003:Aave" "3004:Circuit" "3005:Notifications" "3030:Grafana" "9090:Prometheus")
for entry in "${services[@]}"; do
  port=${entry%:*}
  name=${entry#*:}
  echo -n "  $name (:$port): "
  if curl -s -o /dev/null -w "%{http_code}" --connect-timeout 2 http://localhost:$port 2>/dev/null | grep -q "200\|201\|301\|302"; then
    echo "✓ Healthy"
  else
    echo "✗ Check needed"
  fi
done

# 3. IPv6 access
echo ""
echo "3. IPv6 ACCESS:"
IPV6="2a02:c207:2306:3391::1"
echo "  Server IPv6: $IPV6"
echo "  Test from phone:"
echo "    • API: http://[$IPV6]:3000"
echo "    • Grafana: http://[$IPV6]:3030"

# 4. Quick mobile test
echo ""
echo "4. MOBILE TEST PAGE:"
echo "  http://[$IPV6]:3000/mobile"
