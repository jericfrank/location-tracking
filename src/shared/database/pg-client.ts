import { Pool } from "pg";
import { config } from "../../config";

/**
 * PostgreSQL connection pool
 */
class PostgresClient {
  private static instance: Pool;

  private constructor() {}

  static getInstance(): Pool {
    if (!PostgresClient.instance) {
      PostgresClient.instance = new Pool(config.db);

      PostgresClient.instance.on("error", (err) => {
        console.error("Unexpected PostgreSQL error:", err);
      });
    }

    return PostgresClient.instance;
  }

  static async close(): Promise<void> {
    if (PostgresClient.instance) {
      await PostgresClient.instance.end();
    }
  }
}

export const pool = PostgresClient.getInstance();
export { PostgresClient };
