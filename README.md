# TaskForge

A modern, full-stack task management application built with **React**, **Vite**, **Tailwind CSS**, and **MySQL**.

Forge your path to productivity excellence with intelligent task management, priority levels, dark mode support, and persistent database storage.

## Features

- ✅ **Task Management**: Add, edit, complete, and delete tasks
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode
- 🎯 **Priority Levels**: Mark tasks as high, medium, or low priority
- 📊 **Dashboard**: View productivity stats and recent activity
- 💾 **Persistent Storage**: Save tasks to MySQL database (or localStorage for offline mode)
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🔍 **Search & Filter**: Find tasks by keywords and filter by status
- 📱 **Mobile-Friendly**: Optimized for all screen sizes

## Project Structure

```
task-flow/
├── src/                   # React frontend
│   ├── components/        # Reusable components (Navbar, TaskList)
│   ├── pages/             # Page components (Home, Dashboard, About)
│   ├── App.jsx           # Root component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles (Tailwind)
├── server/               # Express.js backend API
│   └── index.js          # API routes and MySQL integration
├── scripts/              # Utility scripts
│   └── db-init.js        # Database initialization script
├── db/                   # Database files
│   ├── init.sql          # Standard MySQL init (creates user)
│   ├── init_xampp.sql    # XAMPP-friendly init (no user creation)
│   └── README.md         # Database setup guide
├── public/               # Static assets
├── package.json          # Frontend & shared dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.cjs   # Tailwind CSS configuration
├── postcss.config.cjs    # PostCSS configuration
└── .env.example          # Environment variables template
```

## Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** or **XAMPP** (with MySQL/MariaDB)
- **npm** (comes with Node.js)

## Installation

### 1. Clone and Install Dependencies

```bash
cd task-flow
npm install
```

### 2. Set Up Environment

Copy the `.env.example` to `.env` and update values as needed:

```bash
cp .env.example .env
```

`.env` file contents:

```
DB_HOST=localhost
DB_USER=taskflow
DB_PASS=ChangeMe123!
DB_NAME=task_flow_db
PORT=3000
```

**For XAMPP users:**
```
DB_USER=root
DB_PASS=
```

### 3. Initialize Database

Choose one method based on your setup:

#### Option A: Using XAMPP

```bash
npm run db:init:xampp
```

Or manually import `db/init_xampp.sql` via phpMyAdmin:
- Open `http://localhost/phpmyadmin`
- Log in (root, no password by default)
- Click **Import** → select `db/init_xampp.sql` → **Go**

#### Option B: Using System MySQL

```bash
npm run db:init
```

## Running the Application

### Development Mode (Vite frontend + Node backend)

**Terminal 1: Start the frontend dev server**

```bash
npm run dev
```

Vite will start on `http://localhost:5173`

**Terminal 2: Start the backend API server**

```bash
npm run server:dev
```

The API will run on `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## Available npm Scripts

```bash
npm run dev                # Start Vite dev server (frontend)
npm run build              # Build for production
npm run lint               # Run ESLint
npm run preview            # Preview production build
npm run server             # Start Express backend
npm run server:dev         # Start backend with auto-reload (needs nodemon)
npm run db:init            # Initialize MySQL database (standard MySQL)
npm run db:init:xampp      # Initialize database (XAMPP with root user)
```

## API Endpoints

The backend provides REST API endpoints for task management:

| Method | Endpoint           | Description                  |
|--------|------------------|------------------------------|
| GET    | `/api/health`      | Health check                |
| GET    | `/api/tasks`       | Get all tasks               |
| POST   | `/api/tasks`       | Create a new task           |
| PUT    | `/api/tasks/:id`   | Update a task              |
| DELETE | `/api/tasks/:id`   | Delete a task              |

### Example Request (Create Task)

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Finish project","priority":"high"}'
```

## Frontend Configuration

### Tailwind CSS

The project uses **Tailwind CSS** for styling. Configuration is in `tailwind.config.cjs`. Custom CSS is in `src/index.css`.

### PostCSS

PostCSS is configured in `postcss.config.cjs` to process Tailwind directives.

### Vite

Vite configuration is in `vite.config.js`. It's optimized for React with Fast Refresh.

## Database Schema

### Tasks Table

```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Switching Between localStorage and Database

### Current: localStorage (default)

Tasks are stored in browser localStorage. No backend needed.

### Optional: Migrate to MySQL Backend

To switch the frontend to use the Express API instead of localStorage:

1. Update `src/components/TaskList.jsx` to fetch/persist tasks to `http://localhost:3000/api/tasks` instead of localStorage.
2. Run the backend server (`npm run server:dev`).
3. Database will persist tasks across browser sessions and devices.

Example hook migration:

```javascript
// Replace localStorage logic with API calls
useEffect(() => {
  fetch('http://localhost:3000/api/tasks')
    .then(res => res.json())
    .then(data => setTasks(data))
    .catch(err => console.error(err));
}, []);
```

## Troubleshooting

### MySQL Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution**: 
- Ensure MySQL is running (XAMPP Control Panel for XAMPP users)
- Check `DB_HOST`, `DB_USER`, `DB_PASS` in `.env`
- Run `npm run db:init:xampp` to initialize the database

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**: 
- Change `PORT` in `.env` (e.g., `PORT=3001`)
- Or kill the process: `lsof -ti :3000 | xargs kill` (macOS/Linux) or `netstat -ano | findstr :3000` (Windows)

### Tailwind Classes Not Showing

**Error**: Styles are not applied

**Solution**:
- Run `npm install` to ensure `tailwindcss` is installed
- Restart dev server: `npm run dev`
- Check `tailwind.config.cjs` includes `src/**/*.{js,jsx}`

## Contributing

To contribute, fork the repository, create a feature branch, and submit a pull request.

## License

This project is open source. See LICENSE file for details (if present).

## Support

For issues or questions, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ using React, Vite, Tailwind CSS, and MySQL**
