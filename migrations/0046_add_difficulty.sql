-- Add difficulty column to games table for game mode configuration
-- Difficulty determines the player-to-mafia ratio (Easy: 1M/5T, Medium: 2M/9T, Hard: 3M/13T)

-- Add difficulty column with default value 'medium'
ALTER TABLE games 
  ADD COLUMN difficulty TEXT DEFAULT 'medium' 
  CHECK (difficulty IN ('easy', 'medium', 'hard'));

-- Create index for filtering by difficulty
CREATE INDEX IF NOT EXISTS idx_games_difficulty ON games(difficulty);