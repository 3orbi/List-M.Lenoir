import { useState } from 'react'
import './TaskItem.css'

export default function TaskItem({ task, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(task.nom)
  const [editDescription, setEditDescription] = useState(task.description || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleComplete = async () => {
    setIsLoading(true)
    try {
      await onUpdateTask(task.id, { completed: !task.completed })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      alert('Task name cannot be empty')
      return
    }

    setIsLoading(true)
    try {
      await onUpdateTask(task.id, {
        nom: editName.trim(),
        description: editDescription.trim()
      })
      setIsEditing(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsLoading(true)
      try {
        await onDeleteTask(task.id)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isEditing) {
    return (
      <div className="task-item editing">
        <div className="edit-form">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            disabled={isLoading}
            className="edit-input"
            placeholder="Task name"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            disabled={isLoading}
            className="edit-textarea"
            placeholder="Description"
            rows="2"
          />
          <div className="edit-actions">
            <button
              onClick={handleSaveEdit}
              disabled={isLoading}
              className="save-btn"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditName(task.nom)
                setEditDescription(task.description || '')
                setIsEditing(false)
              }}
              disabled={isLoading}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          disabled={isLoading}
          className="task-checkbox"
        />
        <div className="task-text">
          <h3 className="task-name">{task.nom}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <p className="task-date">{formatDate(task.timestamp)}</p>
        </div>
      </div>

      <div className="task-actions">
        <button
          onClick={() => setIsEditing(true)}
          disabled={isLoading}
          className="edit-btn"
          title="Edit task"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="delete-btn"
          title="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
