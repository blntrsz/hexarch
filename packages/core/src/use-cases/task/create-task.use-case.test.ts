import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { createPool, DatabasePool, sql, stringifyDsn } from "slonik";

async function connect(container: StartedPostgreSqlContainer) {
  const pool = await createPool(
    stringifyDsn({
      host: container.getHost(),
      port: container.getPort(),
      databaseName: container.getDatabase(),
      username: container.getUsername(),
      password: container.getPassword(),
    }),
  );

  return pool;
}

describe("CreateTaskUseCase", () => {
  const postgres = new PostgreSqlContainer().withReuse();
  let container: StartedPostgreSqlContainer;
  let pool: DatabasePool;

  beforeEach(async () => {
    container = await postgres.start();
    pool = await connect(container);
  });

  afterEach(async () => {
    await pool.end();
  });

  test("test container", async () => {
    const result = await pool.query(sql.unsafe`SELECT NOW()`);

    expect(result.rows[0]).toEqual({
      now: expect.any(Number),
    });
  });

  test("test container 2", async () => {
    const result = await pool.query(sql.unsafe`SELECT NOW()`);

    expect(result.rows[0]).toEqual({
      now: expect.any(Number),
    });
  });
});
