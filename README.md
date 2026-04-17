# Backend Developer Intern Project Assignment

This repository contains a scalable REST API backend and a supportive React frontend UI for testing authentication and task management.

## Project Structure

- `backend/` - Express API server with JWT authentication, role-based access, and task CRUD operations.
- `frontend/` - Vite + React UI for registering, logging in, and managing tasks.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication with protected routes
- Role-based access control (`user` and `admin`)
- Task CRUD APIs with owner permissions
- API versioning under `/api/v1`
- Swagger API documentation at `/api-docs`
- Input validation and centralized error handling

## Setup

### Backend

1. Copy environment variables:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Install backend dependencies:
   ```bash
   cd backend && npm install
   ```
3. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Install frontend dependencies:
   ```bash
   cd frontend && npm install
   ```
2. Start the frontend:
   ```bash
   npm run dev
   ```
3. Open the local URL shown by Vite (default `http://localhost:5173`).

### Run both services together

From the repository root, install dependencies and start backend + frontend with a single command:

```bash
npm install
npm run dev
```

## API Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `PUT /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`
- `GET /api/v1/health`
- Swagger docs: `http://localhost:5000/api-docs`

## Notes on Scalability

- Modular route and controller structure supports adding new entities quickly.
- JWT stateless auth enables horizontal scaling without session storage.
- MongoDB is used for predictable document storage; a production deployment should use managed clusters.
- To scale further, add Redis caching for frequent reads, a load balancer for multiple app instances, and separate microservices for authentication, tasks, and metrics.

## Optional Deployment

A Docker deployment can be added with a `Dockerfile` and `docker-compose.yml` to run the backend with MongoDB.

### Run with Docker Compose

1. Start MongoDB with Docker Compose:
   ```bash
   docker compose up -d
   ```
2. Confirm MongoDB is running on `mongodb://localhost:27017`.
3. Start the backend normally in another shell:
   ```bash
   cd backend
   npm run dev
   ```

