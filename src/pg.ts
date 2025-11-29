import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "postgres",
  database: "gps_db",
  password: "password",
  port: 5432,
});
