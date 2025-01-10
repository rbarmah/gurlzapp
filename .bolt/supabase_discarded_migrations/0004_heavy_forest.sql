/*
  # Create Health Tracking System
  
  1. New Tables
    - health_cycles: Tracks menstrual cycles and symptoms
      - id (uuid)
      - user_id (uuid, references auth.users)
      - start_date (date)
      - end_date (date)
      - cycle_length (integer)
      - period_length (integer)
      - symptoms (text array)
      - notes (text)
      - created_at (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for private health data
*/

CREATE TABLE IF NOT EXISTS health_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  cycle_length integer NOT NULL,
  period_length integer NOT NULL,
  symptoms text[],
  notes text,
  created_at timestamptz DEFAULT now(),
  CHECK (end_date >= start_date),
  CHECK (cycle_length > 0),
  CHECK (period_length > 0)
);

ALTER TABLE health_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own health data"
  ON health_cycles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);