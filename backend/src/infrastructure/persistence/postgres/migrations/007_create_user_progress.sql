CREATE TABLE IF NOT EXISTS user_progress (
  user_id      VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id   VARCHAR(255) NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (user_id, chapter_id)
);
