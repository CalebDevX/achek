
import { defineConfig } from "drizzle-kit";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

if (!dbHost || !dbPort || !dbName || !dbUser || !dbPass) {
  throw new Error("Database environment variables must be set");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: dbHost,
    port: parseInt(dbPort),
    database: dbName,
    user: dbUser,
    password: dbPass,
  },
  mode: "default",
});
