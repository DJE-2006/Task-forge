import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { users } from '../api/auth/store.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: DB_PORT,
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
  .catch((err) => {
    dbAvailable = false;
    console.error('⚠️  Database unavailable - using in-memory storage');
    // Helpful debug output (does not print password)
    try {
      console.error(`DB connect error: ${err && err.message ? err.message : err}`);
      if (err && err.stack) console.error(err.stack.split('\n').slice(0,5).join('\n'));
    } catch (e) {
      console.error('Error logging DB connection error', e);
    }
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
  const { title, description, completed, priority } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const newTask = {
      id: taskIdCounter++,
      title,
      description: description || null,
      completed: completed ? 1 : 0,
      priority: priority || 'medium',
      created_at: new Date().toISOString(),
    };

    if (dbAvailable) {
      const [result] = await pool.query(
        'INSERT INTO tasks (title, description, completed, priority) VALUES (?, ?, ?, ?)',
        [title, description || null, completed ? 1 : 0, priority || 'medium']
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
      priority: priority || 'medium',
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

// Local auth endpoints to mirror Vercel serverless functions for development
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body || {};

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  if (users.has(email)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    name,
    created_at: new Date().toISOString(),
  };

  users.set(email, newUser);

  res.status(201).json({
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
    token: `token_${newUser.id}`,
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.get(email);
  if (!user) return res.status(401).json({ error: 'User not found' });
  if (user.password !== password) return res.status(401).json({ error: 'Invalid password' });

  res.json({
    user: { id: user.id, email: user.email, name: user.name },
    token: `token_${user.id}`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 TaskForge API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Tasks endpoint: http://localhost:${PORT}/api/tasks`);
});

