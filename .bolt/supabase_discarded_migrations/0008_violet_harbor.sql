/*
  # Create Physical Goals System
  
  1. New Tables
    - physical_goals: Tracks fitness goals and progress
      - id (uuid)
      - user_id (uuid, references auth.users)
      - title (text)
      - target (text)
      - progress (integer)
      - deadline (date)
      - created_at (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for goal management
*/

CREATE TABLE IF NOT EXISTS physical_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  target text NOT NULL,
  progress integer DEFAULT 0,
  deadline date,
  created_at timestamptz DEFAULT now(),
  CHECK (progress >= 0 AND progress <= 100)
);

ALTER TABLE physical_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals"
  ON physical_goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);