-- Pruebas are stored as JSON because they contain nested structures
-- (questions → options → correctOptionIds) that map naturally to JSONB.

CREATE TABLE IF NOT EXISTS pruebas (
  id         VARCHAR(255) PRIMARY KEY,
  volume_id  VARCHAR(255) NOT NULL REFERENCES volumes(id) ON DELETE CASCADE,
  chapter_id VARCHAR(255) NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  questions  JSONB        NOT NULL DEFAULT '[]'
);
