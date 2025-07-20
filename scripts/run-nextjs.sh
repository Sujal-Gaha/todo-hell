#!/bin/bash

echo "Starting Next.js frontend server..."
cd frontend-v1

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Start development server
echo "Starting Next.js server on http://localhost:3000"
npm run dev