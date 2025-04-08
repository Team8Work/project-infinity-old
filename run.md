# Running the Application Locally

## Prerequisites
- Node.js and npm installed
- Docker installed
- Git (for cloning the repository)

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Start the PostgreSQL container:
     ```bash
     docker run -d \
       --name logistics-db \
       -e POSTGRES_USER=postgres \
       -e POSTGRES_PASSWORD=postgres \
       -e POSTGRES_DB=logistics \
       -p 5432:5432 \
       postgres
     ```
   - The database will be accessible at:
     - Host: localhost
     - Port: 5432
     - User: postgres
     - Password: postgres
     - Database: logistics

3. **Run Database Migrations**
   ```bash
   npm run db:push
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:3000

## Managing the Database
- Stop the container: `docker stop logistics-db`
- Start the container: `docker start logistics-db`
- Remove the container: `docker rm logistics-db`

## Troubleshooting
- If you encounter database connection issues, ensure the PostgreSQL container is running
- Check if the port 5432 is not being used by another process
- Verify that all environment variables are correctly set