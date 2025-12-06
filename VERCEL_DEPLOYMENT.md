# TaskForge Vercel Deployment Guide

This guide explains how to deploy TaskForge to Vercel with serverless functions.

## Architecture

TaskForge on Vercel uses:
- **Frontend**: React + Vite deployed as static site
- **Backend**: Vercel Serverless Functions (`/api/*`)
- **Storage**: In-memory (development/preview) or MongoDB (production)

## Quick Deploy

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

### Option 2: Deploy with GitHub Integration

1. **Push to GitHub**
```bash
git remote add origin https://github.com/yourusername/taskforge.git
git push -u origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add: `VITE_API_URL=/api`

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys

## Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
VITE_API_URL=/api
```

This tells the frontend to use Vercel's serverless functions instead of localhost.

## Project Structure for Vercel

```
taskforge/
├── api/                    # Serverless functions
│   ├── tasks.js           # Task CRUD endpoints
│   └── health.js          # Health check
├── src/                    # React frontend
├── public/                 # Static assets
├── vercel.json            # Vercel configuration
├── vite.config.js         # Vite configuration
└── package.json
```

## API Endpoints on Vercel

All endpoints are under `/api/`:

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- `GET /api/health` - Health check

## Local Development

For local development, use the Express backend:

```bash
# Terminal 1: Frontend dev server
npm run dev

# Terminal 2: Backend API
npm run server:dev
```

The frontend will automatically use `http://localhost:3000` for API calls.

## Production Considerations

### 1. Database Integration

For production data persistence, connect to MongoDB:

```bash
# Install MongoDB driver
npm install mongodb
```

Update `api/tasks.js` to use MongoDB instead of in-memory storage.

### 2. Authentication

Implement authentication for task ownership:

```javascript
// api/middleware/auth.js
export function verifyToken(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  // Verify JWT token
  return jwtDecode(token);
}
```

### 3. Rate Limiting

Add rate limiting to prevent abuse:

```bash
npm install @vercel/edge
```

### 4. Analytics

Enable Vercel Analytics:

In `vercel.json`:
```json
{
  "analytics": true,
  "webAnalytics": true
}
```

## Monitoring & Logging

### View Logs

```bash
vercel logs taskforge
```

### Real-time Logs

```bash
vercel logs taskforge --follow
```

## Troubleshooting

### 404 on API routes

Ensure `api/` folder structure is correct and files export default function.

### CORS errors

Verify CORS headers in `api/tasks.js`:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

### Build fails

Check build output:
```bash
vercel build
```

## Domain Configuration

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain (e.g., taskforge.com)
3. Update DNS records as instructed
4. Vercel provides free SSL certificates automatically

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create Vercel account
- [ ] Connect GitHub repository to Vercel
- [ ] Set environment variables
- [ ] Deploy
- [ ] Test all API endpoints
- [ ] Configure custom domain (optional)
- [ ] Enable analytics (optional)
- [ ] Set up database for persistence (optional)
- [ ] Add authentication (optional)

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev)

## Support

For deployment issues, check:
1. Vercel Deployment logs
2. Browser console for frontend errors
3. Network tab for API requests
4. `/api/health` endpoint to verify backend
