/*
  # Create Mental Health Tracking System
  
  1. New Tables
    - mental_entries: Tracks mood and mental health data
      - id (uuid)
      - user_id (uuid, references auth.users)
      - mood (text)
      - notes (text)
      - symptoms (text array)
      - created_at (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for private mental health data
*/

CREATE TABLE IF NOT EXISTS mental_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  mood text NOT NULL,
  notes text,
  symptoms text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mental_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own mental health data"
  ON mental_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);