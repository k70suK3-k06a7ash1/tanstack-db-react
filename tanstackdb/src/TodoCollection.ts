import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { QueryClient } from '@tanstack/react-query'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

// Mock API functions for demonstration
const mockTodos: Todo[] = [
  { id: '1', text: 'Learn TanStack DB', completed: false, createdAt: Date.now() - 3600000 },
  { id: '2', text: 'Build a todo app', completed: false, createdAt: Date.now() - 1800000 },
  { id: '3', text: 'Deploy to production', completed: false, createdAt: Date.now() }
]

const mockFetchTodos = async (): Promise<Todo[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return [...mockTodos]
}

const mockUpdateTodo = async (todo: Todo): Promise<Todo> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  console.log('Mock API: Updated todo', todo)
  return todo
}

const mockCreateTodo = async (todo: Todo): Promise<Todo> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  console.log('Mock API: Created todo', todo)
  return todo
}

const mockDeleteTodo = async (todo: Todo): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  console.log('Mock API: Deleted todo', todo)
}

// Define a collection that loads data using TanStack Query
export const todoCollection = createCollection(
  queryCollectionOptions({
    queryKey: ['todos'],
    queryFn: mockFetchTodos,
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const { modified: newTodo } = transaction.mutations[0]
      await mockCreateTodo(newTodo as Todo)
    },
    onUpdate: async ({ transaction }) => {
      const { modified } = transaction.mutations[0]
      await mockUpdateTodo(modified as Todo)
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0]
      await mockDeleteTodo(original as Todo)
    },
    queryClient: new QueryClient()
  })
)