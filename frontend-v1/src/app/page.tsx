'use client'

import { useState, useEffect } from 'react'

interface Todo {
  id: number
  title: string
  completed: boolean
  created_at: string
  updated_at: string
}

const API_BASE = 'http://localhost:8000/api'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE}/todos/`)
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch(`${API_BASE}/todos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodo,
          completed: false,
        }),
      })
      
      if (response.ok) {
        setNewTodo('')
        fetchTodos()
      }
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return

      await fetch(`${API_BASE}/todos/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          completed: !completed,
        }),
      })
      
      fetchTodos()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await fetch(`${API_BASE}/todos/${id}/`, {
        method: 'DELETE',
      })
      
      fetchTodos()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Todo App</h1>
      
      <form onSubmit={addTodo} className="flex gap-4 mb-8">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Todo
        </button>
      </form>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
        
        {todos.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No todos yet. Add one above!
          </div>
        )}
      </div>
    </div>
  )
}