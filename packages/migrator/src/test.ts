import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { runner } from "node-pg-migrate";
import { Client } from "pg";
import path from "node:path";

export async function migrate(container: StartedPostgreSqlContainer) {
  const client = new Client({
    host: container.getHost(),
    port: container.getPort(),
    database: container.getDatabase(),
    user: container.getUsername(),
    password: container.getPassword(),
  });

  await client.connect();
  await runner({
    direction: "up",
    count: 1,
    migrationsTable: "migrations",
    databaseUrl: client,
    verbose: true,
    dir: path.join(import.meta.dirname, "../migrations"),
  });
  await client.end();
}
