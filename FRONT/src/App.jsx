import { useState, useEffect } from 'react'
import './App.css'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/tasks`)
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data = await response.json()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Add new task
  const handleAddTask = async (taskData) => {
    try {
      console.log('Adding task with data:', taskData)
      console.log('API URL:', API_URL)

      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to add task: ${response.status} ${errorText}`)
      }

      const newTask = await response.json()
      console.log('New task received:', newTask)

      setTasks([newTask, ...tasks])
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error adding task:', err)
    }
  }

  // Update task
  const handleUpdateTask = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!response.ok) throw new Error('Failed to update task')
      const updatedTask = await response.json()
      setTasks(tasks.map(task => task.id === id ? updatedTask : task))
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error updating task:', err)
    }
  }

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete task')
      setTasks(tasks.filter(task => task.id !== id))
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error deleting task:', err)
    }
  }

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>My Tasks</h1>
          <p className="subtitle">Stay organized and productive</p>
        </div>
      </header>

      <main className="app-main">
        <div className="main-content">
          {error && <div className="error-message">{error}</div>}

          <TaskForm onAddTask={handleAddTask} />

          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <TaskList
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
