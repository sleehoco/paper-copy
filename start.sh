#!/bin/bash

# Start PocketBase in background
/app/pb/pocketbase serve --http=0.0.0.0:8090 --dir=/data/pb_data &

# Wait for PocketBase to start
sleep 2

# Start SvelteKit
node build
