import dotenv from "dotenv";
import { Pool } from "pg";
// initialize environment variables
dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DATABASE,
  POSTGRES_PORT,
  ENV,
} = process.env;

// a connection to the database
let client: Pool;
console.log(ENV);

if (ENV === "dev") {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: +POSTGRES_PORT as number,
  });
} else if (ENV === "test") {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DATABASE,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: +POSTGRES_PORT as number,
  });
}

export default client;
