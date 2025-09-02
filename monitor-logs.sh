#!/bin/bash

# Script para monitorar logs do sistema Hypesoft em tempo real

echo "=== MONITOR DE LOGS HYPESOFT ==="
echo ""
echo "Pressione Ctrl+C para parar o monitoramento"
echo ""

# Monitorar logs de todos os serviços
docker-compose logs -f --tail=20
