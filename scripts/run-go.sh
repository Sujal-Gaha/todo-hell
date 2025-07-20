#!/bin/bash

echo "Starting Go backend server..."
cd backend-v2

# Download dependencies
echo "Downloading Go dependencies..."
go mod tidy

# Start server
echo "Starting Go server on http://localhost:8001"
go run main.go