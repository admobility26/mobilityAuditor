#!/bin/sh
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo "Necesitas Node.js 22.13 o superior para iniciar el asistente."
  read -r pausa
  exit 1
fi
node asistente-local.mjs
