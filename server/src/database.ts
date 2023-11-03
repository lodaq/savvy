import dotenv from 'dotenv';
import { Pool } from 'pg';
// initialize environment variables
dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_TEST_HOST,
  POSTGRES_TEST_DATABASE,
  POSTGRES_TEST_USER,
  POSTGRES_TEST_PORT,
  POSTGRES_TEST_PASSWORD,
  ENV,
} = process.env;

// a connection to the database
let client: Pool;
console.log(ENV);

if (ENV === 'dev') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: +POSTGRES_PORT as number,
  });
} else if (ENV === 'test') {
  client = new Pool({
    host: POSTGRES_TEST_HOST,
    database: POSTGRES_TEST_DATABASE,
    user: POSTGRES_TEST_USER,
    password: POSTGRES_TEST_PASSWORD,
    port: +POSTGRES_TEST_PORT as number,
  });
}

export default client;

/* import { configDotenv } from "dotenv";
import postgres from "postgres";

configDotenv();

const connectionString = process.env.POSTGRES_CONNECTION_STRING;
const sql = postgres(connectionString);

console.log(connectionString);

export default sql; */
