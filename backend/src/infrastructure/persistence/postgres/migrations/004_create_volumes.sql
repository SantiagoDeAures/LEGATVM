CREATE TABLE IF NOT EXISTS volumes (
  id          VARCHAR(255) PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT         NOT NULL DEFAULT '',
  categories  TEXT[]       NOT NULL DEFAULT '{}',
  price       NUMERIC(12, 2) NOT NULL DEFAULT 0,
  thumbnail   TEXT         NOT NULL DEFAULT ''
);
