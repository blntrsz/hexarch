-- Up Migration
CREATE TYPE status_enum AS ENUM ('to_do', 'in_progress', 'done');

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  status status_enum NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Down Migration
DROP TABLE IF EXISTS tasks;
DROP TYPE IF EXISTS status_enum;
