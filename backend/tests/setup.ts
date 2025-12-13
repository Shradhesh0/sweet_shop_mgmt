import { Pool } from 'pg';
import pool from '../src/config/database';
import dotenv from 'dotenv';

// Ensure NODE_ENV is set to 'test' for Jest
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

dotenv.config();

// Helper function to validate and escape database name
function validateDatabaseName(dbName: string): string {
  // Only allow alphanumeric, underscore, and hyphen characters
  if (!/^[a-zA-Z0-9_-]+$/.test(dbName)) {
    throw new Error(`Invalid database name: ${dbName}. Only alphanumeric, underscore, and hyphen characters are allowed.`);
  }
  // Escape the database name (double quotes for identifiers)
  return `"${dbName}"`;
}

// Helper function to create test database if it doesn't exist
async function ensureTestDatabase() {
  const dbPassword = (process.env.DB_PASSWORD ?? '').toString().trim();
  const testDbName = process.env.TEST_DB_NAME || 'sweets_db_test';
  const dbUser = process.env.DB_USER || 'shradhesh';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432');
  
  const escapedDbName = validateDatabaseName(testDbName);

  // Connect to default postgres database to create test database
  const adminPool = new Pool({
    host: dbHost,
    port: dbPort,
    database: 'postgres',
    user: dbUser,
    password: dbPassword,
  });

  try {
    // Check if test database exists
    const result = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [testDbName]
    );

    if (result.rows.length === 0) {
      // Create test database (database names can't be parameterized in CREATE DATABASE)
      await adminPool.query(`CREATE DATABASE ${escapedDbName}`);
      console.log(`Test database "${testDbName}" created successfully`);
    } else {
      console.log(`Test database "${testDbName}" already exists`);
    }
  } catch (error: any) {
    // If database already exists, that's fine
    if (error.code !== '42P04') {
      console.error('Error creating test database:', error);
      throw error;
    }
  } finally {
    await adminPool.end();
  }
}

// used testing DB for this
beforeAll(async () => {
  // Ensure test database exists
  await ensureTestDatabase();

  // Now create tables in the test database
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sweets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

beforeEach(async () => {
  // clean the tables before new tests
  await pool.query('TRUNCATE TABLE sweets RESTART IDENTITY CASCADE');
  await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
});

afterAll(async () => {
  // Drop test tables and close connection
  await pool.query('DROP TABLE IF EXISTS sweets CASCADE');
  await pool.query('DROP TABLE IF EXISTS users CASCADE');
  await pool.end();
});