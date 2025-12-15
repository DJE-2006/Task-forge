import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'taskflow',
  password: process.env.DB_PASS || 'ChangeMe123!',
  database: process.env.DB_NAME || 'task_flow_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

let memoryTasks = [];
let taskIdCounter = 1;
let dbAvailable = false;

pool.getConnection()
  .then(() => {
    dbAvailable = true;
    console.log('✅ Database connected');
  })
  .catch(() => {
    dbAvailable = false;
    console.log('⚠️  Database unavailable - using in-memory storage');
  });

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TaskForge API is running',
    dbAvailable 
  });
});

app.get('/api/tasks', async (req, res) => {
  try {
    if (dbAvailable) {
      const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
      res.json(rows);
    } else {
      res.json(memoryTasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.json(memoryTasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title, description, completed } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const newTask = {
      id: taskIdCounter++,
      title,
      description: description || null,
      completed: completed ? 1 : 0,
      created_at: new Date().toISOString(),
    };

    if (dbAvailable) {
      const [result] = await pool.query(
        'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
        [title, description || null, completed ? 1 : 0]
      );
      newTask.id = result.insertId;
    } else {
      memoryTasks.push(newTask);
    }

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    memoryTasks.push({
      id: taskIdCounter++,
      title,
      description: description || null,
      completed: completed ? 1 : 0,
      created_at: new Date().toISOString(),
    });
    res.status(201).json(memoryTasks[memoryTasks.length - 1]);
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    if (dbAvailable) {
      await pool.query(
        'UPDATE tasks SET completed = ? WHERE id = ?',
        [completed ? 1 : 0, id]
      );
    } else {
      const task = memoryTasks.find(t => t.id === parseInt(id));
      if (task) {
        task.completed = completed ? 1 : 0;
      }
    }

    res.json({ id, completed });
  } catch (error) {
    console.error('Error updating task:', error);
    const task = memoryTasks.find(t => t.id === parseInt(id));
    if (task) {
      task.completed = completed ? 1 : 0;
      res.json({ id, completed });
    } else {
      res.status(500).json({ error: 'Failed to update task' });
    }
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (dbAvailable) {
      const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
    } else {
      memoryTasks = memoryTasks.filter(t => t.id !== parseInt(id));
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    memoryTasks = memoryTasks.filter(t => t.id !== parseInt(id));
    res.json({ message: 'Task deleted successfully' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 TaskForge API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Tasks endpoint: http://localhost:${PORT}/api/tasks`);
});

