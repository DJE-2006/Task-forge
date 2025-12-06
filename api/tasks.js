// Vercel Serverless Function - Tasks API
// This handles all task operations

// In-memory storage for development/preview
let memoryTasks = [];
let taskIdCounter = 1;

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET all tasks
  if (req.method === 'GET') {
    res.status(200).json(
      memoryTasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    );
    return;
  }

  // POST create task
  if (req.method === 'POST') {
    const { title, description, completed, priority } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const newTask = {
      id: taskIdCounter++,
      title,
      description: description || '',
      completed: completed || false,
      priority: priority || 'medium',
      created_at: new Date().toISOString(),
    };

    memoryTasks.push(newTask);
    res.status(201).json(newTask);
    return;
  }

  // PUT update task
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { completed, title, description } = req.body;

    const task = memoryTasks.find(t => t.id === parseInt(id));
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (completed !== undefined) task.completed = completed;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;

    res.status(200).json(task);
    return;
  }

  // DELETE task
  if (req.method === 'DELETE') {
    const { id } = req.query;

    memoryTasks = memoryTasks.filter(t => t.id !== parseInt(id));
    res.status(200).json({ message: 'Task deleted successfully' });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
