# Metro Nexus

A full-stack metro transit application built with React, TypeScript, Express, MongoDB, and Vite. Features real-time journey planning, station exploration, ticket management, and interactive network visualization.

## Tech Stack

**Frontend**
- React 19 + TypeScript + Vite
- React Router v7 for routing
- Tailwind CSS v4 for styling
- Motion (Framer Motion) for animations
- TanStack Query for data fetching

**Backend**
- Express.js + TypeScript (ESM)
- MongoDB with Mongoose
- JWT authentication with bcryptjs
- Express Rate Limit for API protection
- WebSocket support for real-time features

**Deployment**
- Netlify (frontend)
- Render / Railway / Fly.io (backend)

---

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- npm or pnpm

### Frontend Setup

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Copy env template and configure
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.

# Start dev server (http://localhost:4000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

**Frontend** (`.env` in root):
```env
VITE_API_URL=http://localhost:4000/api
VITE_WS_URL=ws://localhost:4000
```

**Backend** (`server/.env`):
```env
PORT=your-port-here
NODE_ENV=your-node-env-here
MONGODB_URI=your-mongodb-uri-here
JWT_SECRET=your-super-secret-jwt-key-change-me
JWT_EXPIRES_IN=7d
FRONTEND_URL=your-frontend-url-here
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Journey Planner** | Multi-modal route planning with real-time data |
| **Station Explorer** | Interactive station details, facilities, connections |
| **Network Map** | Animated SVG/Canvas network visualization |
| **Tickets** | Purchase, manage, and validate digital tickets |
| **Auth** | JWT-based auth with signup/login, protected routes |
| **Real-time** | WebSocket hub for live updates (delays, crowding) |
| **Design Studio** | Creative tools for station concepts |

---

## Available Scripts

**Root (Frontend)**
```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check + production build
npm run lint      # Run Oxlint
npm run preview   # Preview production build
```

**Server**
```bash
npm run dev       # Start with tsx watch mode
npm run build     # Compile TypeScript to dist/
npm start         # Run compiled production server
npm run test      # Run Vitest tests
```

---

## Deployment

### Netlify (Frontend)

1. Connect repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard:
   - `VITE_API_URL` - Your backend API URL
   - `VITE_WS_URL` - Your backend WebSocket URL

The `netlify.toml` ensures devDependencies (TypeScript, Vite) are installed during build without forcing a build-time environment override.

### Backend (Serverless)

1. Set `server` as root directory
2. Build command: `npm run build`
3. Start command: `npm start`
4. Add all backend environment variables

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | Login, returns JWT |
| `GET` | `/api/auth/me` | Get current user (protected) |
| `GET` | `/api/stations` | List all stations |
| `GET` | `/api/stations/:id` | Station details |
| `GET` | `/api/journeys` | Plan journey |
| `GET` | `/api/tickets` | User's tickets (protected) |
| `POST` | `/api/tickets` | Purchase ticket (protected) |
| `WS` | `/ws` | Real-time updates |

---

## Development

### Code Style
- **Oxlint** for fast linting (configured in `.oxlintrc.json`)
- **TypeScript** strict mode enabled
- **ESM** modules throughout

### Git Workflow
```bash
# Feature branches from main
git checkout -b feat/journey-planner

# Commit with conventional messages
git commit -m "feat: add multi-modal journey planner"

# Push and open PR
git push origin feat/journey-planner
```

---

Developed by the Tech Mobius Club
