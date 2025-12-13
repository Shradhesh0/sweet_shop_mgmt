# Docker Deployment Guide

This project includes Docker configurations for easy deployment of the entire application stack.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### Production Deployment

1. **Build and start all services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **Stop and remove volumes (deletes database data):**
   ```bash
   docker-compose down -v
   ```

## Services

The docker-compose setup includes:

1. **PostgreSQL Database** (postgres)
   - Port: 5432
   - Database: sweets_db
   - User: shradhesh
   - Password: Shradhu1234
   - Data persisted in volume: `postgres_data`

2. **Backend API** (backend)
   - Port: 3000
   - Environment: production
   - Automatically runs migrations on startup

3. **Frontend React App** (frontend)
   - Port: 80
   - Served via nginx
   - Built with API URL pointing to backend

## Configuration

### Environment Variables

Edit `docker-compose.yml` to customize:

- **Database credentials** (postgres service)
- **Backend environment** (backend service)
- **JWT Secret** - **IMPORTANT**: Change `JWT_SECRET` in production!

### Frontend API URL

The frontend is built with `REACT_APP_API_URL` pointing to `http://localhost:3000/api`. 

If deploying to a different domain, update the build arg:
```yaml
frontend:
  build:
    args:
      REACT_APP_API_URL: https://your-api-domain.com/api
```

## Building Individual Images

### Backend Only
```bash
cd backend
docker build -t sweets-backend .
```

### Frontend Only
```bash
cd frontend
docker build --build-arg REACT_APP_API_URL=http://localhost:3000/api -t sweets-frontend .
```

## Accessing the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000/api
- **Database**: localhost:5432

## Database Access

Connect to PostgreSQL:
```bash
docker exec -it sweets_db psql -U shradhesh -d sweets_db
```

## Troubleshooting

### Check service status
```bash
docker-compose ps
```

### View specific service logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Rebuild specific service
```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Reset everything
```bash
docker-compose down -v
docker-compose up -d --build
```

## Production Considerations

1. **Change default passwords** in `docker-compose.yml`
2. **Set a strong JWT_SECRET** 
3. **Use environment files** for sensitive data:
   ```yaml
   env_file:
     - .env.production
   ```
4. **Enable HTTPS** by adding a reverse proxy (nginx/traefik)
5. **Backup database volumes** regularly
6. **Use Docker secrets** for sensitive data in production

## Development Mode

For development with hot-reload, use the dev override:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

