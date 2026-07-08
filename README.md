# BizForz Machine Task

A full-stack application built with a modern tech stack featuring a React frontend and Node.js/Express backend with MongoDB.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Running the Application](#-running-the-application)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 8
- **Styling**: TailwindCSS 4
- **State Management**: Zustand 5
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios 1.18
- **UI Components**: Custom components with Boneyard.js
- **Linting**: ESLint 10 with TypeScript ESLint

### Backend (Core)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose 9
- **Dependency Injection**: InversifyJS 8
- **Authentication**: JWT (jsonwebtoken 9) + bcryptjs 3
- **Validation**: Zod 4
- **Security**: Helmet 8, CORS 2.8
- **Cookies**: cookie-parser 1.4
- **Development**: tsx for hot reload

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.x (LTS recommended)
- **pnpm** >= 11.x (package manager)
- **MongoDB** >= 6.x (local or remote instance)

### Install pnpm
```bash
npm install -g pnpm
# or
brew install pnpm  # macOS
```

## 📁 Project Structure

```
bizForzMachineTask/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── features/   # Feature-specific components
│   │   │   └── ui/         # Reusable UI components
│   │   ├── config/         # Configuration files
│   │   ├── constants/      # Application constants
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Routing configuration
│   │   ├── services/       # API service layer
│   │   ├── stores/         # Zustand stores
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Root component
│   │   └── main.tsx        # Entry point
│   ├── .env                # Frontend environment variables
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vercel.json         # Vercel deployment config
│
├── core/                   # Backend Node.js application
│   ├── src/
│   │   ├── config/         # Configuration (db, env, cookies, seed)
│   │   ├── constants/      # Application constants
│   │   ├── controllers/    # Request handlers
│   │   ├── di/             # Dependency injection setup
│   │   ├── dto/            # Data transfer objects
│   │   ├── handlers/       # Response & error handlers
│   │   ├── helpers/        # Helper functions
│   │   ├── mappers/        # Data mappers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── model/          # Mongoose models
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── validations/    # Validation schemas
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── .env.example        # Backend environment template
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile          # Docker configuration
│
└── README.md               # This file
```

## 🚀 Backend Setup

### 1. Navigate to backend directory
```bash
cd core
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Configure environment variables
Copy the example environment file and update values:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Server Configuration
PORT=7000
NODE_ENV=development

# Database
DATABASE_URI=mongodb://localhost:27017/bizforz

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# JWT Secrets (generate strong secrets for production!)
ACCESS_TOKEN_SECRET=your_super_secure_access_token_secret
REFRESH_TOKEN_SECRET=your_super_secure_refresh_token_secret
```

### 4. Start MongoDB
Ensure MongoDB is running locally, via Docker, or update `DATABASE_URI` to point to your MongoDB instance.

**Option A: Local MongoDB**
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Option B: Docker MongoDB (Recommended)**
```bash
# Run MongoDB in Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest

# Or with Docker Compose (create docker-compose.yml in core/)
# version: '3.8'
# services:
#   mongodb:
#     image: mongo:latest
#     ports:
#       - "27017:27017"
#     volumes:
#       - mongodb_data:/data/db
# volumes:
#   mongodb_data:

# Then run:
# docker-compose up -d
```

**Option C: MongoDB Atlas (Cloud)**
Update `DATABASE_URI` with your Atlas connection string:
```
mongodb+srv://<username>:<password>@cluster.mongodb.net/bizforz
```

### 5. Run database seeding (optional)
The project includes a seed script for initial data:
```bash
pnpm run seed
# or manually: tsx src/config/seed.ts
```

## 🎨 Frontend Setup

### 1. Navigate to frontend directory
```bash
cd client
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Configure environment variables
The frontend uses a `.env` file (already present):
```env
VITE_BACKEND_URL=http://localhost:7000/api
```

Update if your backend runs on a different URL.

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd core
pnpm run dev
# Server starts at http://localhost:7000
```

**Terminal 2 - Frontend:**
```bash
cd client
pnpm run dev
# App starts at http://localhost:5173
```

### Production Build

**Backend:**
```bash
cd core
pnpm run build
pnpm run start
```

**Frontend:**
```bash
cd client
pnpm run build
pnpm run preview
```

## 🔐 Environment Variables

### Backend (core/.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `7000` | Yes |
| `NODE_ENV` | Environment mode | `development` | Yes |
| `DATABASE_URI` | MongoDB connection string | `mongodb://localhost:27017` | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` | Yes |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | - | Yes |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | - | Yes |

### Frontend (client/.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_BACKEND_URL` | Backend API base URL | `http://localhost:7000/api` | Yes |

## 📜 Available Scripts

### Backend (core/package.json)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `tsx watch src/server.ts` | Start development server with hot reload |
| `build` | `tsc` | Compile TypeScript to JavaScript |
| `start` | `node dist/server.js` | Start production server |

### Frontend (client/package.json)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start development server |
| `build` | `tsc -b && vite build` | Build for production |
| `lint` | `eslint .` | Run ESLint |
| `preview` | `vite preview` | Preview production build locally |

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Logout user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/:id` | Get user by ID |
| `PATCH` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Delete user |

### Roles
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/roles` | Get all roles |
| `POST` | `/api/roles` | Create role |
| `PATCH` | `/api/roles/:id` | Update role |
| `DELETE` | `/api/roles/:id` | Delete role |

### Permissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/permissions` | Get all permissions |
| `POST` | `/api/permissions` | Create permission |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | Get all projects |
| `POST` | `/api/projects` | Create project |
| `GET` | `/api/projects/:id` | Get project by ID |
| `PATCH` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |

## 🐳 Deployment

### Backend (Docker)
```bash
cd core
docker build -t bizforz-backend .
docker run -p 7000:7000 --env-file .env bizforz-backend
```

### Frontend (Vercel)
The frontend is configured for Vercel deployment with `vercel.json`:
```bash
cd client
vercel deploy
```

Or connect your repository to Vercel for automatic deployments.

### Environment Variables for Production
Ensure you set the following in your deployment platform:
- **Backend**: All variables from `.env` with production values
- **Frontend**: `VITE_BACKEND_URL` pointing to your production API URL

## 🔧 Development Tips

### Database Seeding
Run the seed script to populate initial data:
```bash
cd core
tsx src/config/seed.ts
```

### Type Checking
```bash
# Backend
cd core && pnpm run build

# Frontend
cd client && pnpm run build
```

### Linting
```bash
cd client && pnpm run lint
```

## 📝 License

ISC License - See individual package.json files for details.

---

**Happy Coding!** 🎉