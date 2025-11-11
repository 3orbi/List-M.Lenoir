-- Initialize TodoList Database

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disable Row Level Security for testing (enable in production)
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_timestamp ON tasks(timestamp DESC);

-- Allow INSERT from all origins
GRANT ALL PRIVILEGES ON TABLE tasks TO PUBLIC;
GRANT USAGE, SELECT ON SEQUENCE tasks_id_seq TO PUBLIC;

-- Sample data (optional)
-- INSERT INTO tasks (nom, description, completed) VALUES
-- ('Learn Docker', 'Master Docker containerization', false),
-- ('Build Todo App', 'Create full-stack application', false),
-- ('Deploy to Docker Hub', 'Push images to registry', false);
