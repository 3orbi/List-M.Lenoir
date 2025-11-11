import TaskItem from './TaskItem'
import './TaskList.css'

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">📋</p>
        <p className="empty-text">No tasks yet. Create one to get started!</p>
      </div>
    )
  }

  const completedCount = tasks.filter(task => task.completed).length

  return (
    <div className="task-list-container">
      <div className="task-stats">
        <p>{completedCount} of {tasks.length} tasks completed</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  )
}
