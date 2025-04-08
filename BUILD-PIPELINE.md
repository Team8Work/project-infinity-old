# Build Pipeline Setup

This document provides an overview of the build pipeline setup for Project Infinity.

## Overview

The build pipeline automates the process of building, testing, and deploying the application. It is implemented using GitHub Actions and consists of several workflows that handle different aspects of the CI/CD process.

## Workflow Files

The following workflow files have been created in the `.github/workflows` directory:

### 1. CI/CD Pipeline (`ci-cd.yml`)

This workflow handles the core build and test process:

- Triggered on pushes and pull requests to main/master branches
- Sets up Node.js environment
- Installs dependencies
- Performs type checking
- Builds the application
- Uploads build artifacts for deployment

### 2. Docker Build and Push (`docker-build.yml`)

This workflow handles building and pushing Docker images:

- Triggered on pushes to main/master branches and tag creation
- Builds a Docker image using the provided Dockerfile
- Pushes the image to GitHub Container Registry
- Supports versioning through tags

### 3. Deployment (`deploy.yml`)

This workflow handles deployment to production:

- Triggered after successful completion of the CI/CD Pipeline workflow
- Downloads build artifacts
- Deploys the application to the production environment

## Local Development

A Docker Compose file (`docker-compose.yml`) has been created to facilitate local development:

```bash
# Start the database container
docker-compose up -d

# Run the application in development mode
npm run dev
```

## Docker Support

A Dockerfile has been created to containerize the application. This ensures consistency across development, testing, and production environments.

```bash
# Build the Docker image
docker build -t project-infinity .

# Run the container
docker run -p 3000:3000 project-infinity
```

## Getting Started

1. Push your code to GitHub
2. The CI/CD pipeline will automatically trigger on pushes to main/master branches
3. Monitor the workflow execution in the GitHub Actions tab of your repository
4. After successful build and tests, the deployment workflow will deploy the application

## Customization

You may need to customize the workflow files based on your specific requirements:

- Update the Node.js version if needed
- Add specific test commands when tests are available
- Configure deployment steps based on your hosting provider
- Add environment variables and secrets for sensitive information

## Troubleshooting

If you encounter issues with the build pipeline:

1. Check the GitHub Actions logs for detailed error messages
2. Verify that all dependencies are correctly specified in package.json
3. Ensure Docker is properly configured if using containerized builds
4. Check that the required secrets are properly set in your GitHub repository settings