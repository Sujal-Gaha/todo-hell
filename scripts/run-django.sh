#!/bin/bash

echo "Starting Django backend server..."
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