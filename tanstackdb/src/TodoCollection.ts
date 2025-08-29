import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { QueryClient } from '@tanstack/react-query'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

// API base URL for Elysia backend
const API_BASE_URL = 'http://localhost:3000'

const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_BASE_URL}/todos`)
  if (!response.ok) {
    throw new Error('Failed to fetch todos')
  }
  return response.json()
}

const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  })
  if (!response.ok) {
    throw new Error('Failed to update todo')
  }
  return response.json()
}

const createTodo = async (todo: Todo): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  })
  if (!response.ok) {
    throw new Error('Failed to create todo')
  }
  return response.json()
}

const deleteTodo = async (todo: Todo): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete todo')
  }
}

// Define a collection that loads data using TanStack Query
export const todoCollection = createCollection(
  queryCollectionOptions({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const { modified: newTodo } = transaction.mutations[0]
      await createTodo(newTodo as Todo)
    },
    onUpdate: async ({ transaction }) => {
      const { modified } = transaction.mutations[0]
      await updateTodo(modified as Todo)
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0]
      await deleteTodo(original as Todo)
    },
    queryClient: new QueryClient()
  })
)