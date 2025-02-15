#!/bin/sh

# Wait for the server to be ready
echo "Waiting for server to be ready..."
while ! wget -q --spider http://server:8001/api/health; do
  echo "Server is not ready - sleeping"
  sleep 5
done

echo "Server is ready - starting nginx"
exec "$@"
