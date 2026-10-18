#!/usr/bin/env bash
set -euo pipefail

CONFIG_FILE="$HOME/.cloudflared/nk-wedding.yml"

echo "🚀 Connecting Cloudflare Tunnel: nk-wedding..."
echo "  • Public Primary URL: https://nk-wedding.japs.dev"
echo "  • Public Short Alias: https://wedding.japs.dev"
echo "  • Local Origin:       http://localhost:3040"
cloudflared tunnel --config "$CONFIG_FILE" run nk-wedding
