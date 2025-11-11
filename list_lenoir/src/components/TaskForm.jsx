import { useState } from 'react'
import './TaskForm.css'

export default function TaskForm({ onAddTask }) {
  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!taskName.trim()) {
      alert('Please enter a task name')
      return
    }

    setSubmitting(true)
    try {
      await onAddTask({
        nom: taskName.trim(),
        description: taskDescription.trim()
      })
      setTaskName('')
      setTaskDescription('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="What do you need to do?"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          disabled={submitting}
          className="task-input"
        />
      </div>

      <div className="form-group">
        <textarea
          placeholder="Add a description (optional)"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          disabled={submitting}
          className="task-textarea"
          rows="2"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="submit-btn"
      >
        {submitting ? 'Adding...' : '+ Add Task'}
      </button>
    </form>
  )
}
