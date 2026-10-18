#!/usr/bin/env bash
set -euo pipefail

WEB_PORT="3040"

kill_port() {
  local port="$1"
  local pids
  pids=$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "🧹 Freeing port $port (PIDs: $pids)..."
    kill -9 $pids 2>/dev/null || true
  fi
}

kill_port "$WEB_PORT"

echo "✨ Starting Next.js Web App on http://localhost:${WEB_PORT} (Tunnel: https://nk-wedding.japs.dev)..."
npm run dev
