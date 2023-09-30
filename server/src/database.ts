import { Pool } from "pg";

import dotenv from "dotenv";

dotenv.config();

const {
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} = process.env;

const client = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DATABASE,
  password: POSTGRES_PASSWORD,
  port: +POSTGRES_PORT as number,
});

export default client;
