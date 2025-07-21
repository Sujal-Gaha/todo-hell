#!/bin/bash

echo "🚀 Todo App Server Launcher"
echo "=========================="
echo "Which server would you like to run?"
echo ""
echo "1) Django Backend (Python) - Port 8000"
echo "2) Go Backend (Gin) - Port 8001" 
echo "3) Next.js Frontend - Port 1234"
echo "4) Exit"
echo ""

function run_backend_v1() {
    echo ""
    echo "🐍 Starting Django backend server..."
    cd backend-v1
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies
    echo "Installing dependencies..."
    pip install -r requirements.txt
    
    # Run migrations
    echo "Running migrations..."
    python manage.py makemigrations
    python manage.py migrate
    
    # Start server
    echo "Starting Django server on http://localhost:8000"
    python manage.py runserver 8000
}

function run_backend_v2() {
    echo ""
    echo "🐹 Starting Go backend server..."
    cd backend-v2
    
    # Download dependencies
    echo "Downloading Go dependencies..."
    go mod tidy
    
    # Start server
    echo "Starting Go server on http://localhost:8001"
    go run main.go
}

function run_frontend_v1() {
    echo ""
    echo "⚛️  Starting Next.js frontend server..."
    cd frontend-v1
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "Installing npm dependencies..."
        yarn install
    fi
    
    # Start development server
    echo "Starting Next.js server on http://localhost:1234"
    yarn dev
}

while true; do
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            run_backend_v1
            break
            ;;
        2)
            run_backend_v2
            break
            ;;
        3)
            run_frontend_v1
            break
            ;;
        4)
            echo "Goodbye! 👋"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please enter 1, 2, 3, or 4."
            ;;
    esac
done