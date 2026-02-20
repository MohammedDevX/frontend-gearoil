# Docker Setup for GearOil Frontend

This project is configured to run in Docker containers. Follow the steps below to build and run the application.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed and running
- [Docker Compose](https://docs.docker.com/compose/install/) (optional, for docker-compose commands)

## Building the Docker Image

```bash
docker build -t gearoil-frontend .
```

This creates a multi-stage Docker image that:
1. Installs dependencies
2. Builds the Angular application with SSR support
3. Copies only necessary files to the final image for minimal size

## Running the Container

### Option 1: Using Docker Compose (Recommended)

```bash
docker-compose up
```

The application will be available at `http://localhost:4200`

To run in background:
```bash
docker-compose up -d
```

To stop the container:
```bash
docker-compose down
```

### Option 2: Using Docker CLI

```bash
docker run -p 4200:4200 gearoil-frontend
```

The application will be available at `http://localhost:4200`

### Option 3: Development with Hot Reload

For development with file watching, use Docker with volume mounting:

```bash
docker run -it -p 4200:4200 -v $(pwd)/src:/app/src node:20-alpine npm start
```

## Dockerfile Explanation

The Dockerfile uses a **multi-stage build** approach:

1. **Builder Stage**: Installs all dependencies (including dev) and builds the Angular app
2. **Runtime Stage**: Creates a minimal production image with only runtime dependencies

Benefits:
- Smaller final image size
- Faster deployments
- Keeps development tools out of production

## Environment Variables

You can customize the app behavior by setting environment variables:

```bash
docker run -p 4200:4200 -e NODE_ENV=production gearoil-frontend
```

## Pushing to a Registry

To push your image to Docker Hub or another registry:

```bash
docker tag gearoil-frontend your-username/gearoil-frontend:latest
docker push your-username/gearoil-frontend:latest
```

## Troubleshooting

- **Port already in use**: Change the port mapping in docker-compose.yml or CLI command
  ```bash
  docker run -p 3000:4200 gearoil-frontend
  ```

- **Build fails**: Ensure all npm dependencies are compatible
  ```bash
  npm install
  npm run build
  ```

- **Container exits immediately**: Check logs
  ```bash
  docker logs <container-id>
  ```

## Additional Commands

View running containers:
```bash
docker ps
```

View container logs:
```bash
docker logs <container-id>
```

Stop a running container:
```bash
docker stop <container-id>
```

Remove an image:
```bash
docker rmi gearoil-frontend
```
