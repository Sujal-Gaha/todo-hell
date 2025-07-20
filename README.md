# Todo App Practice Project

A full-stack todo application with multiple backend implementations for learning purposes.

## Project Structure

- `backend-v1/` - Django REST API server (Python)
- `backend-v2/` - Gin REST API server (Go)
- `frontend-v1/` - Next.js React application
- `scripts/` - Server startup scripts

## Quick Start

```bash
# Run Script
./run-server.sh
```

```bash
🚀 Todo App Server Launcher

Which server would you like to run?

# Choose server
1. Django Backend (Python) - Port 8000
2. Go Backend (Gin) - Port 8001
3. Next.js Frontend - Port 1234
4. Exit
```

## API Endpoints

All backends implement the same REST API:

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
