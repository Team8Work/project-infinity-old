# Local Development Environment Setup

## PostgreSQL Database Setup

1. Make sure you have Docker installed on your system

2. Run the following command to create and start a PostgreSQL container:
```bash
docker run --name logistics-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=logistics -p 5432:5432 -d postgres:latest
```

This command will:
- Create a container named 'logistics-db'
- Set up PostgreSQL with the following credentials:
  - Username: postgres
  - Password: postgres
  - Database: logistics
- Map port 5432 on your host to port 5432 in the container
- Use the latest PostgreSQL image

3. Verify the database connection using the following credentials:
- Host: localhost
- Port: 5432
- User: postgres
- Password: postgres
- Database: logistics
- SSL: disabled

## Database Environment

### Setting up Docker Network
```bash
docker network create logistics-network
```

### PostgreSQL Container
```bash
docker run -d \
  --name logistics-db \
  --network logistics-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=logistics \
  -p 5432:5432 \
  postgres
```

### pgAdmin Container
```bash
docker run -d \
  --name logistics-pgadmin \
  --network logistics-network \
  -e PGADMIN_DEFAULT_EMAIL=admin@admin.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  -p 5050:80 \
  dpage/pgadmin4
```

Access pgAdmin at http://localhost:5050
- Login with:
  - Email: admin@admin.com
  - Password: admin
- To connect to PostgreSQL server in pgAdmin:
  1. Add New Server
  2. Name: logistics-db
  3. Connection:
     - Host: logistics-db
     - Port: 5432
     - Database: logistics
     - Username: postgres
     - Password: postgres

### Managing Containers

#### PostgreSQL
- Stop: `docker stop logistics-db`
- Start: `docker start logistics-db`
- Remove: `docker rm logistics-db`

#### pgAdmin
- Stop: `docker stop logistics-pgadmin`
- Start: `docker start logistics-pgadmin`
- Remove: `docker rm logistics-pgadmin`