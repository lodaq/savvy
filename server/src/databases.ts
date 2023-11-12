import dotenv from 'dotenv';
import mongoose, { Schema, Document, model, Types } from 'mongoose';
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
  MONGODB_URI,
} = process.env;

console.log(ENV);

// setup postgres
let client: Pool;

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

// setup mongoose
async function main() {
  await mongoose.connect(MONGODB_URI);
}

main()
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));

export default client;
