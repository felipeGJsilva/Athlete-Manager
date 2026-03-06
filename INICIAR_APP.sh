#!/usr/bin/env bash
# INICIAR_APP.sh - Reinicia backend (uvicorn) e opcionalmente frontend (Vite)
# Usage: ./INICIAR_APP.sh [--frontend]

set -e
DIR=$(cd "$(dirname "$0")" && pwd)
cd "$DIR"

echo "Stopping any process on ports 8000 (backend) and 5173 (frontend)..."
if command -v fuser >/dev/null 2>&1; then
  fuser -k 8000/tcp || true
  fuser -k 5173/tcp || true
else
  pkill -f "uvicorn backend.app.main" || true
  pkill -f "vite" || true
fi

# Start backend
echo "Starting backend..."
# Run in background and redirect logs
nohup uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload > backend.log 2>&1 &
BACKEND_PID=$!
sleep 1
if ps -p $BACKEND_PID > /dev/null; then
  echo "Backend started (pid=$BACKEND_PID)"
else
  echo "Failed to start backend. Check backend.log"
fi

# Optionally start frontend dev server
if [ "$1" = "--frontend" ] || [ "$START_FRONTEND" = "1" ]; then
  echo "Starting frontend (Vite)..."
  (cd frontend && nohup npm run dev > ../frontend.log 2>&1 &) 
  echo "Frontend started (see frontend.log)"
fi

echo "Done. Tail backend.log for output: tail -n 50 backend.log"
