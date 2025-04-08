import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Local PostgreSQL connection configuration
const connectionConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'logistics',
  ssl: false
};

export const pool = new Pool(connectionConfig);
export const db = drizzle(pool, { schema });

// Export the connection string for use with connect-pg-simple
export const connectionString = `postgresql://${connectionConfig.user}:${connectionConfig.password}@${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`;
