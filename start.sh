#!/bin/bash

# Run migrations
/app/pb/pocketbase migrate --dir=/data/pb_data --migrationsDir=/app/pb_migrations

# Start PocketBase in background
/app/pb/pocketbase serve --http=0.0.0.0:8090 --dir=/data/pb_data &

# Wait for PocketBase to start
sleep 2

# Start SvelteKit
node build
