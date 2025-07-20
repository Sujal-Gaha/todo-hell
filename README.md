# Todo App Practice Project

A full-stack todo application with multiple backend implementations for learning purposes.

## Project Structure

- `backend-v1/` - Django REST API server (Python)
- `backend-v2/` - Gin REST API server (Go)
- `frontend-v1/` - Next.js React application
- `scripts/` - Server startup scripts

## Quick Start

```bash
# Run Django backend
./scripts/run-django.sh

# Run Go backend  
./scripts/run-go.sh

# Run Next.js frontend
./scripts/run-nextjs.sh
```

## API Endpoints

All backends implement the same REST API:
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo