import { useLiveQuery, eq } from '@tanstack/react-db'
import { todoCollection, type Todo } from './TodoCollection'
import { useState } from 'react'

function TodoList() {
  // Basic filtering and sorting
  const { data: incompleteTodos = [] } = useLiveQuery((q) =>
    q.from({ todo: todoCollection })
     .where(({ todo }) => eq(todo.completed, false))
  )

  // All todos for summary
  const { data: allTodos = [] } = useLiveQuery((q) =>
    q.from({ todo: todoCollection })
  )

  return (
    <div>
      <h3>Incomplete Todos ({incompleteTodos.length})</h3>
      <ul>
        {incompleteTodos
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
      </ul>
      
      <h3>All Todos Summary</h3>
      <ul>
        {allTodos.map((todo) => (
          <li key={todo.id} style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#888' : '#000'
          }}>
            {todo.text} ({todo.completed ? 'done' : 'pending'})
          </li>
        ))}
      </ul>
    </div>
  )
}

function TodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const toggleComplete = () => {
    todoCollection.update(todo.id, (draft) => {
      draft.completed = !draft.completed
    })
  }

  const updateText = () => {
    todoCollection.update(todo.id, (draft) => {
      draft.text = editText
    })
    setIsEditing(false)
  }

  const deleteTodo = () => {
    todoCollection.delete(todo.id)
  }

  return (
    <li style={{ margin: '8px 0', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={toggleComplete}
        />
        
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={updateText}
            onKeyDown={(e) => e.key === 'Enter' && updateText()}
            autoFocus
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              flex: 1,
              cursor: 'pointer'
            }}
          >
            {todo.text}
          </span>
        )}
        
        <button onClick={deleteTodo} style={{ color: 'red' }}>
          Delete
        </button>
      </div>
    </li>
  )
}

function AddTodoForm() {
  const [newTodoText, setNewTodoText] = useState('')

  const addTodo = () => {
    if (newTodoText.trim()) {
      todoCollection.insert({
        id: crypto.randomUUID(),
        text: newTodoText.trim(),
        completed: false,
        createdAt: Date.now(),
      })
      setNewTodoText('')
    }
  }

  return (
    <div style={{ margin: '16px 0', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
      <h3>Add New Todo</h3>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Enter todo text..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px' }}>
          Add Todo
        </button>
      </div>
    </div>
  )
}

export default function TodoApp() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>TanStack DB Quick Start - Todo App</h1>
      <p>This demonstrates live queries, optimistic mutations, and CRUD operations.</p>
      
      <AddTodoForm />
      <TodoList />
    </div>
  )
}