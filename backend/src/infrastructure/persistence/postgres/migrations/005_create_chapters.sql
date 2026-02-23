CREATE TABLE IF NOT EXISTS chapters (
  id          VARCHAR(255) PRIMARY KEY,
  volume_id   VARCHAR(255) NOT NULL REFERENCES volumes(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  type        VARCHAR(50)  NOT NULL,
  content_url TEXT         NOT NULL DEFAULT ''
);
