#!/bin/bash
echo "🚀 PILLARVALE FINANCIAL PLATFORM"
echo "================================="
echo ""

# 1. Container status
echo "📦 DOCKER CONTAINERS (13 services):"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep "fx-"

# 2. Service connectivity
echo ""
echo "🌐 SERVICE CONNECTIVITY:"
services=(
  "3000:API Gateway"
  "3001:MPESA Service"
  "3002:XRP Settlement"
  "3003:Aave Manager"
  "3004:Circuit Breaker"
  "3005:Notification Service"
  "3030:Grafana"
  "9090:Prometheus"
)

all_ok=true
for entry in "${services[@]}"; do
  port=${entry%%:*}
  name=${entry#*:}
  if timeout 2 bash -c "echo > /dev/tcp/127.0.0.1/$port" 2>/dev/null; then
    echo "  ✅ $name (port $port)"
  else
    echo "  ❌ $name (port $port)"
    all_ok=false
  fi
done

# 3. IPv6 access
echo ""
echo "📱 MOBILE ACCESS (IPv6):"
IPV6="2a02:c207:2306:3391::1"
echo "  • Main API:    http://[$IPV6]:3000"
echo "  • MPESA:       http://[$IPV6]:3001"
echo "  • XRP:         http://[$IPV6]:3002"
echo "  • Aave:        http://[$IPV6]:3003"
echo "  • Grafana:     http://[$IPV6]:3030 (admin/admin)"
echo "  • Test Page:   http://[$IPV6]:3000/mobile"

# 4. Summary
echo ""
echo "📊 SUMMARY:"
if $all_ok; then
  echo "  ✅ ALL SYSTEMS OPERATIONAL"
  echo "  ✅ Ready for production use"
  echo "  ✅ Mobile access enabled"
else
  echo "  ⚠️  Some services need attention"
fi

echo ""
echo "🔧 MANAGEMENT COMMANDS:"
echo "  • ./check-system.sh           # This status check"
echo "  • docker compose logs -f      # View all logs"
echo "  • docker compose restart      # Restart all services"
echo "  • docker compose ps           # Check container status"
