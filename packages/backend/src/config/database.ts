import { createConnection } from 'mysql';

/* Raw SQL used for any miss feature from prisma */

const db = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT!),
  database: process.env.DB_NAME,
  multipleStatements: true,
});

export default db;
